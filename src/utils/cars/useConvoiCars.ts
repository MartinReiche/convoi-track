import * as React from 'react';
import getFirebase from "../getFirebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";
import {Car} from "../cars";
import {MapLocation} from "../../components/map/models";

export function useConvoiCars() {
    const [cars, setCars] = React.useState<Car[]|null>(null);
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        const carDocsRef = collection(db, `projects/${user.project}/convois/${id}/cars`);
        const unsubscribe = onSnapshot(carDocsRef, (snap) => {
            let carDocs: Car[] = [];
            snap.forEach(doc => carDocs.push({
                id: doc.id,
                project: doc.data().project,
                convoi: doc.data().convoi,
                name: doc.data().name,
                numberPlate: doc.data().numberPlate,
                crew: doc.data().crew,
                guests: doc.data().guests,
                freeSeats: doc.data().freeSeats,
                from: doc.data().from && new MapLocation(doc.data().from),
                position: doc.data().position && new MapLocation(doc.data().position),
                heading: doc.data().heading && new MapLocation(doc.data().heading),
                destination: doc.data().destination && new MapLocation(doc.data().destination),
                updatedAt: doc.data().updatedAt
            }));
            setCars(carDocs);
        });
        return function cleanUp() {
            unsubscribe()
        };
    }, [id, user.project]);

    return cars;
}

export default useConvoiCars;