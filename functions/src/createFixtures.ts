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
    destination: {
      address: "072 51, Slovakia, Vyšné Nemecké",
      location: new admin.firestore.GeoPoint(48.66112742163311, 22.262808868534815),
      date: new Date("2022-04-17T11:00:00"),
    },
    etd: new Date("2022-03-17T12:00:00"),
    createdAt: new Date("2022-03-15T12:00:00"),
    cars: [
      {
        name: "Tim & Anna",
        numberplate: "L-HC-1337",
        crew: 0,
        guests: 0,
        from: {
          address: "Leipzig, Startadresse",
          location: new admin.firestore.GeoPoint(51.30741649829015, 12.374281590207698),
          date: new Date("2022-03-17T12:00:00"),
        },
        position: {
          address: "Dreieck Nossen",
          location: new admin.firestore.GeoPoint(51.05543338953122, 13.370823029736687),
          date: new Date("2022-03-17T14:00:00"),
        },
        heading: {
          address: "Deutsch-Tschechische Grenze",
          location: new admin.firestore.GeoPoint(50.78325692001859, 13.897759517922443),
          date: new Date("2022-04-17T11:00:00"),
        },
        destination: {
          address: "072 51, Slovakia, Vyšné Nemecké",
          location: new admin.firestore.GeoPoint(48.66112742163311, 22.262808868534815),
          date: new Date("2022-04-17T11:00:00"),
        },
        updatedAt: new Date("2022-03-17T14:00:00"),
        drivers: [
          {name: "Anna", email: "anna@mail.com", phone: "1234-12345678"},
          {name: "Tim", email: "tim@mail.com", phone: "1234-12345678"},
        ],
        status: [
          {
            from: {
              address: "Leipzig, Startadresse",
              location: new admin.firestore.GeoPoint(51.30741649829015, 12.374281590207698),
              date: new Date("2022-03-17T12:00:00"),
            },
            position: {
              address: "Leipzig, Startadresse",
              location: new admin.firestore.GeoPoint(51.30741649829015, 12.374281590207698),
              date: new Date("2022-03-17T12:00:00"),
            },
            heading: {
              address: "Deutsch-Tschechische Grenze",
              location: new admin.firestore.GeoPoint(50.78325692001859, 13.897759517922443),
              date: new Date("2022-04-17T11:00:00"),
            },
            destination: {
              address: "072 51, Slovakia, Vyšné Nemecké",
              location: new admin.firestore.GeoPoint(48.66112742163311, 22.262808868534815),
              date: new Date("2022-04-17T11:00:00"),
            },
            crew: 2,
            guests: 0,
            misc: "Start in Leipzig",
            updatedAt: new Date("2022-03-17T12:00:00"),
          },
          {
            from: {
              address: "Deutsch-Tschechische Grenze",
              location: new admin.firestore.GeoPoint(50.78325692001859, 13.897759517922443),
              date: new Date("2022-04-17T11:00:00"),
            },
            position: {
              address: "Dreieck Nossen",
              location: new admin.firestore.GeoPoint(51.05543338953122, 13.370823029736687),
              date: new Date("2022-03-17T14:00:00"),
            },
            heading: {
              address: "Deutsch-Tschechische Grenze",
              location: new admin.firestore.GeoPoint(50.78325692001859, 13.897759517922443),
              date: new Date("2022-04-17T11:00:00"),
            },
            destination: {
              address: "072 51, Slovakia, Vyšné Nemecké",
              location: new admin.firestore.GeoPoint(48.66112742163311, 22.262808868534815),
              date: new Date("2022-04-17T11:00:00"),
            },
            crew: 2,
            guests: 0,
            misc: "Start in Leipzig",
            updatedAt: new Date("2022-03-17T14:00:00"),
          },
        ],
      },
    ],
  },
];

export const createFixtures = functions
    .https.onCall(async (data, context) => {
      // Only allow admin users to execute this function.
      if (!(context.auth?.token?.role === "admin")) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Must be an administrative user to create fixtures."
        );
      }

      console.log(`User ${context.auth.uid} has called function to create fixtures`);

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
            .add({
              project: project.id,
              name: convoi.name,
              destination: convoi.destination,
              etd: convoi.etd,
            });

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
                position: car.position,
                heading: car.heading,
                destination: car.destination,
                updatedAt: car.updatedAt,
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

      return "Fixtures created!";
    });


