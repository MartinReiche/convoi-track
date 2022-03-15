import * as React from 'react';
import {Convoi} from '.';
import getFirebase from "../getFirebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";

export function useConvois() {
    const [convois, setConvois] = React.useState<Convoi[] | null>(null);
    const {user} = useAuth();

    React.useEffect(() => {
        const {db} = getFirebase();
        let convoisDocs: Convoi[] = [];
        const convoisRef = collection(db, `projects/${user.project}/convois/`);
        const unsubscribe = onSnapshot(convoisRef, (snap) => {
            snap.forEach(doc => {
                convoisDocs.push({id: doc.id, ...doc.data()} as Convoi)
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