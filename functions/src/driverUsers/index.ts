import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addDriverUser = functions.firestore
    .document("drivers/{id}")
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
        return null;
      } catch (error) {
        console.error(error);
        return false;
      }
    });

export const removeDriverUser = functions.firestore
    .document("drivers/{id}")
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
