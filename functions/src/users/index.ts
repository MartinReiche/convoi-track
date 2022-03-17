import * as functions from "firebase-functions";
import {addUser, deleteUser, createUser} from "./utils";
import * as admin from "firebase-admin";

export const addDriverUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/convois/{convoiId}/cars/{carId}/addDriverRequest/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId, convoiId, carId} = params;
      const userRecordCollection = `projects/${projectId}/convois/${convoiId}/cars/${carId}/drivers`;
      const claims = {role: "driver", project: projectId, convoi: convoiId, car: carId};
      await addUser({snap, claims, userRecordCollection});
    });

export const removeDriverUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/convois/{convoiId}/cars/{carId}/drivers/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });

export const addOrgaUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/addOrgaRequest/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId} = params;
      const userRecordCollection = `projects/${projectId}/orga`;
      const claims = {role: "orga", project: projectId};
      await addUser({snap, claims, userRecordCollection});
    });

export const removeOrgaUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/orga/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });


export const addProjectAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/addAdminRequest/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId} = params;
      const userRecordCollection = `projects/${projectId}/admins`;
      const claims = {role: "project-admin", project: projectId};
      await addUser({snap, claims, userRecordCollection});
    });

export const removeProjectAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/admins/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });

export const addAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("admins/{email}")
    .onCreate(async (snap, {params}) => {
      const user = await createUser(params.email, snap.data().name);
      await admin.auth().setCustomUserClaims(user.uid, {role: "admin"});
      console.log(`Created Admin User with: ${params.email}`);
      return snap.ref.update({uid: user.uid});
    });

export const removeAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("admins/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });
