import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addOrgaUser = functions
    .region("europe-west1")
    .firestore
    .document("orga/{id}")
    .onCreate(async (snap) => {
      try {
        // get admin record from firestore
        const userRecord = snap.data();
        if (!userRecord) return null;
        const user = await admin.auth()
            .createUser({
              email: userRecord.email,
              emailVerified: true,
              password: "secretPassword",
              displayName: userRecord.name,
              disabled: false,
            });
        if (!user) return null;
        // set custom user claim 'role' to admin
        await admin.auth().setCustomUserClaims(user.uid, {role: "orga"});

        const actionCodeSettings = {
          url: "http://localhost:3000/",
          handleCodeInApp: true,
        };

        admin.auth()
            .generateSignInWithEmailLink(userRecord.email, actionCodeSettings)
            .then((link) => {
              // Construct sign-in with email link template, embed the link and
              // send using custom SMTP server.
              // return sendSignInEmail(usremail, displayName, link);
              console.log(link);
            })
            .catch((error) => {
              console.error(error);
            });


        return null;
      } catch (error) {
        console.error(error);
        return false;
      }
    });

export const removeOrgaUser = functions
    .region("europe-west1")
    .firestore
    .document("orga/{id}")
    .onDelete(async (snap) => {
      try {
        // get admin record from firestore
        const userRecord = snap.data();
        if (!userRecord) return null;
        // retrieve user with email in admin record
        const user = await admin.auth().getUserByEmail(userRecord.email);
        if (!user) return null;
        await admin.auth().deleteUser(user.uid);
        return null;
      } catch (error) {
        console.error(error);
        return false;
      }
    });
