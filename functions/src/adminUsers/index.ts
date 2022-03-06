import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const addAdminRightsToUser = functions.firestore
    .document("admins/{id}")
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
        await admin.auth().setCustomUserClaims(user.uid, {role: "admin"});
        return null;
      } catch (error) {
        console.error(error);
        return false;
      }
    });

export const removeAdminRightsFromUser = functions.firestore
    .document("admins/{id}")
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
