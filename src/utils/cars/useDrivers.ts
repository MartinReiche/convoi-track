import * as React from 'react';
import getFirebase from "../getFirebase";
import {collection, onSnapshot, query, Query, where} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";

export type Driver = {
    id: string
    project: string
    convoi: string
    car: string
    name: string
    email: string
    phone: string
    public: boolean
}

function useDrivers(carId: string) {
    const [drivers, setDrivers] = React.useState<Driver[]>();
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        let driverQuery: Query
        if (user.role === 'driver') {
            driverQuery = query(
                collection(db, `projects/${user.project}/convois/${id}/cars/${carId}/drivers`),
                where( 'public', "==", true)
            );
        } else {
            driverQuery = collection(db, `projects/${user.project}/convois/${id}/cars/${carId}/drivers`);
        }
        const unsubscribe = onSnapshot(driverQuery, (snap) => {
            let driverDocs: Driver[] = [];
            snap.forEach(doc => driverDocs.push({id: doc.id, ...doc.data()} as Driver));
            setDrivers(driverDocs);
        });
        return function cleanUp() {
            unsubscribe()
        };
    }, [id, carId, user.project, user.role]);

    return drivers;
}

export default useDrivers;