import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const onLoginRequest = functions
    .region("europe-west1")
    .firestore
    .document("loginRequests/{id}")
    .onCreate(async (snap) => {
      // check if user exists
      try {
        await admin.auth().getUserByEmail(snap.data().email);

        const actionCodeSettings = {
          url: snap.data().host,
          handleCodeInApp: true,
        };

        const link = await admin.auth().generateSignInWithEmailLink(snap.data().email, actionCodeSettings);

        console.log("Login Link created for user", snap.data().email);
        console.log(link);

        admin.firestore().collection("loginRequests").doc(snap.id).update({
          email: admin.firestore.FieldValue.delete(),
          host: admin.firestore.FieldValue.delete(),
          success: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "There is no user record corresponding to the provided identifier.") {
            console.log("Update ");
            await admin.firestore().collection("loginRequests").doc(snap.id).update({
              email: admin.firestore.FieldValue.delete(),
              host: admin.firestore.FieldValue.delete(),
              success: false,
              error: error.message,
            });
          }
        }
      }
    });

