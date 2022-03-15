import * as React from 'react';
import getFirebase from "../getFirebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";
import {Car} from "../cars";

function useConvoiCars() {
    const [cars, setCars] = React.useState<Car[]>();
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        const carStatusRef = collection(db, `projects/${user.project}/convois/${id}/cars`);
        const unsubscribe = onSnapshot(carStatusRef, (snap) => {
            let carDocs: Car[] = [];
            snap.forEach(doc => carDocs.push({id: doc.id, ...doc.data()} as Car));
            setCars(carDocs);
        });
        return function cleanUp() {
            unsubscribe()
        };
    }, [id, user.project]);

    return cars;
}

export default useConvoiCars;