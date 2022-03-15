import * as React from 'react';
import getFirebase from "../getFirebase";
import {collection, GeoPoint, onSnapshot, Timestamp} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";
import {Location} from "../cars";

export type CarStatus = {
    id: string
    project: string
    convoi: string
    car: string
    crew: number
    guests: number
    misc?: string
    from: Location
    position: Location
    heading: GeoPoint
    destination: GeoPoint
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
            snap.forEach(doc => carStatusDocs.push({id: doc.id, ...doc.data()} as CarStatus));
            setCarStatus(carStatusDocs);
        });
        return function cleanUp() {
            unsubscribe()
        };
    }, [id, carId, user.project]);

    return carStatus;
}

export default useCarStatus;