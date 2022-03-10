import * as functions from "firebase-functions";
import {addUser, deleteUser} from "./utils";

export const addDriverUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/convois/{convoiId}/cars/{carId}/adddriver/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId, convoiId, carId} = params;
      const userRecordCollection = `projects/${projectId}/convois/${convoiId}/cars/${carId}/drivers`;
      const claims = {driver: true, project: projectId, convoi: convoiId, car: carId};
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
    .document("projects/{projectId}/addorga/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId} = params;
      const userRecordCollection = `projects/${projectId}/orga`;
      const claims = {orga: true, project: projectId};
      await addUser({snap, claims, userRecordCollection});
    });

export const removeOrgaUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/orga/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });


export const addAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/addadmin/{id}")
    .onCreate(async (snap, {params}) => {
      const {projectId} = params;
      const userRecordCollection = `projects/${projectId}/admins`;
      const claims = {admin: true, project: projectId};
      await addUser({snap, claims, userRecordCollection});
    });

export const removeAdminUser = functions
    .region("europe-west1")
    .firestore
    .document("projects/{projectId}/admins/{email}")
    .onDelete(async (snap, {params}) => {
      return deleteUser(params.email);
    });
