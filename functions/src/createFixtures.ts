import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const host = "http://localhost:3000/";

const admins = [
  {email: "martin@reiche.dev", name: "Martin"},
];

const orga = [
  {email: "marcus@mission-lifieline.de", name: "Marcus"},
  {email: "nora@mission-lifeline.de", name: "Nora"},
  {email: "john@mission-lifieline.de", name: "John"},
  {email: "mila@mission-lifeline.de", name: "Mila"},
  {email: "rob@mission-lifeline.de", name: "Ron"},
  {email: "becca@mission-lifeline.de", name: "Becca"},
];

const convois = [
  {
    name: "Convoi to Uzhgorod #1",
    date: new Date("2022-03-17T12:00:00"),
    cars: [
      {
        name: "Tim & Anna",
        numberplate: "L-HC-1337",
        crew: 0,
        guests: 0,
        from: {lat: 51.30741649829015, lng: 12.374281590207698},
        to: {lat: 48.66112742163311, lng: 22.262808868534815},
        eta: new Date("2022-04-17T11:00:00"),
        drivers: [
          {name: "Anna", email: "anna@mail.com", phone: "1234-12345678"},
          {name: "Tim", email: "tim@mail.com", phone: "1234-12345678"},
        ],
        status: [
          {
            pos: {lat: 51.30741649829015, lng: 12.374281590207698},
            to: {lat: 48.66112742163311, lng: 22.262808868534815},
            eta: new Date("2022-04-17T10:30:00"),
            date: new Date("2022-03-17T12:05:00"),
            crew: 2,
            guests: 0,
            misc: "Start in Leipzig",
          },
          {
            pos: {lat: 51.17407848718044, lng: 15.024802536254738},
            to: {lat: 48.66112742163311, lng: 22.262808868534815},
            eta: new Date("2022-04-17T11:00:00"),
            date: new Date("2022-03-17T14:45:00"),
            crew: 2,
            guests: 0,
            misc: "Grenzübergtritt D -> PL",
          },
        ],
      },
      {
        name: "Caroline & Sebastian",
        numberplate: "L-HC-1337",
        crew: 0,
        guests: 0,
        from: null,
        to: {lat: 48.66112742163311, lng: 22.262808868534815},
        eta: null,
        drivers: [],
        status: [],
      },
    ],


  },
  {
    name: "Convoi to Uzhgorod #2",
    date: new Date("2022-04-17T10:00:00"),
    orga: [
      {email: "nora@mission-lifeline.de", name: "Nora"},
    ],
    cars: [],
  },
];

export const createFixtures = functions
    .region("europe-west1")
    .https.onRequest(async (req: any, res: any) => {
      // create Project
      const project = await admin.firestore().collection("projects").add({name: "Mission Lifeline"});

      // create admin account
      admins.map(async (user) => {
        await admin.firestore()
            .collection(`projects/${project.id}/addAdminRequest`)
            .add({project: project.id, ...user, host});
      });

      // create orga account
      orga.map(async (user) => {
        await admin.firestore()
            .collection(`projects/${project.id}/addOrgaRequest`)
            .add({project: project.id, ...user, host});
      });


      // create convois
      convois.map(async (convoi) => {
        const convoiRef = await admin.firestore()
            .collection(`projects/${project.id}/convois`)
            .add({project: project.id, name: convoi.name, date: convoi.date});

        // create cars
        convoi.cars.map(async (car) => {
          // create car
          const carRef = await admin.firestore()
              .collection(`projects/${project.id}/convois/${convoiRef.id}/cars`)
              .add({
                project: project.id,
                convoi: convoiRef.id,
                name: car.name,
                numberPlate: car.numberplate,
                crew: car.crew,
                guests: car.guests,
                from: car.from,
                to: car.to,
              });

          // create drivers
          car.drivers.map(async (driver) => {
            await admin.firestore()
                .collection(`projects/${project.id}/convois/${convoiRef.id}/cars/${carRef.id}/addDriverRequest`)
                .add({
                  project: project.id,
                  convoi: convoiRef.id,
                  carId: carRef.id,
                  host,
                  ...driver,
                });
          });

          // create status
          car.status.map(async (status) => {
            await admin.firestore()
                .collection(`projects/${project.id}/convois/${convoiRef.id}/cars/${carRef.id}/status`)
                .add({
                  project: project.id,
                  convoi: convoiRef.id,
                  carId: carRef.id,
                  ...status,
                });
          });
        });
      });

      return res.send("Fixtures created!");
    });


