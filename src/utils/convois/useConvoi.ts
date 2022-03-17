import * as React from 'react';
import {Convoi} from '.';
import getFirebase from "../getFirebase";
import {doc, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";
import {MapLocation} from "../../components/map/models";

export function useConvoi() {
    const [convoi, setConvoi] = React.useState<Convoi | null>(null);
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        const convoiRef = doc(db, `projects/${user.project}/convois/${id}`);
        const unsubscribe = onSnapshot(convoiRef, (doc) => {
            if (!doc.exists()) return null;
            setConvoi({
                    id: doc.id,
                    project: doc.data().project as string,
                    name: doc.data().name as string,
                    destination: new MapLocation(doc.data().destination),
                    etd: doc.data().etd,
                    createdAt: doc.data().createdAt
                });
        });

        return function cleanUp() {
            unsubscribe()
        };
    }, [id, user.project]);

    return convoi;
}


export default useConvoi;