import * as admin from "firebase-admin";

interface addUserParameters {
    snap: admin.firestore.QueryDocumentSnapshot
    userRecordCollection: string,
    claims: object
}

export const addUser = async ({snap, userRecordCollection, claims}: addUserParameters) => {
  const {email, name, host} = snap.data();
  try {
    // create user
    const user = await createUser(email, name);
    console.log("User", email, "created.");
    // set custom user claim role to admin
    await admin.auth().setCustomUserClaims(user.uid, claims);
    // prepare log in link
    const actionCodeSettings = {
      url: host,
      handleCodeInApp: true,
    };
    const logInLink = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
    // send login Link
    console.log("Login Link Created for User", email);
    console.log(logInLink);
    await admin.firestore().collection(userRecordCollection).doc(email)
        .set({name, email, uid: user.uid});
    await snap.ref.set({success: true});
    return null;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) await snap.ref.set({error: error.message});
    return false;
  }
};

export const createUser = async (email: string, name: string) => {
  return admin.auth()
      .createUser({
        email: email,
        emailVerified: true,
        displayName: name,
        disabled: false,
      });
};

export const deleteUser = async (email: string) => {
  try {
    // retrieve user with email in admin record
    const user = await admin.auth().getUserByEmail(email);
    if (!user) return null;
    await admin.auth().deleteUser(user.uid);
    console.log("Deleted User", user.email);
    return null;
  } catch (e) {
    return false;
  }
};
