import * as React from 'react';
import {Convoi} from '.';
import getFirebase from "../getFirebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {MapLocation} from "../../components/map/models";

export function useConvois() {
    const [convois, setConvois] = React.useState<Convoi[] | null>(null);
    const {user} = useAuth();

    React.useEffect(() => {
        const {db} = getFirebase();
        let convoisDocs: Convoi[] = [];
        const convoisRef = collection(db, `projects/${user.project}/convois/`);
        const unsubscribe = onSnapshot(convoisRef, (snap) => {
            snap.forEach(doc => {
                const convoi = {
                    id: doc.id,
                    project: doc.data().project as string,
                    name: doc.data().name as string,
                    destination: new MapLocation(doc.data().destination),
                    etd: doc.data().etd,
                    createdAt: doc.data().createdAt
                };
                convoisDocs.push(convoi);
            });
            setConvois(convoisDocs);
        });

        return function cleanUp() {
            unsubscribe()
        };
    }, [user.project]);

    return convois;
}


export default useConvois;