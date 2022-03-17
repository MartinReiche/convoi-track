import * as React from 'react';
import getFirebase from "../getFirebase";
import {collection, onSnapshot, Timestamp} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";
import {MapLocation} from "../../components/map/models";

export type CarStatus = {
    id: string
    project: string
    convoi: string
    car: string
    crew: number
    guests: number
    misc?: string
    from: MapLocation
    position: MapLocation
    heading: MapLocation
    destination: MapLocation
    updatedAt: Timestamp
}

function useCarStatus(carId: string) {
    const [carStatus, setCarStatus] = React.useState<CarStatus[]>();
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        const carStatusRef = collection(db, `projects/${user.project}/convois/${id}/cars/${carId}/status`);
        const unsubscribe = onSnapshot(carStatusRef, (snap) => {
            let carStatusDocs: CarStatus[] = [];
            snap.forEach(doc => carStatusDocs.push({
                id: doc.id,
                project: doc.data().project,
                convoi: doc.data().convoi,
                car: doc.data().car,
                crew: doc.data().crew,
                guests: doc.data().guests,
                misc: doc.data().misc,
                from: new MapLocation(doc.data().from),
                position: new MapLocation(doc.data().position),
                heading: new MapLocation(doc.data().heading),
                destination: new MapLocation(doc.data().destination),
                updatedAt: doc.data().updatedAt
            }));
            setCarStatus(carStatusDocs);
        });
        return function cleanUp() {
            unsubscribe()
        };
    }, [id, carId, user.project]);

    return carStatus;
}

export default useCarStatus;