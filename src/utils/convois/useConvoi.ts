import * as React from 'react';
import {Convoi} from '.';
import getFirebase from "../getFirebase";
import {doc, onSnapshot} from "firebase/firestore";
import {useAuth} from "../../components/auth/authProvider";
import {useParams} from "react-router-dom";

export function useConvoi() {
    const [convoi, setConvoi] = React.useState<Convoi | null>(null);
    const {user} = useAuth();
    const {id} = useParams();

    React.useEffect(() => {
        const {db} = getFirebase();
        const convoiRef = doc(db, `projects/${user.project}/convois/${id}`);
        const unsubscribe = onSnapshot(convoiRef, (doc) => {
            setConvoi({id: doc.id, ...doc.data()} as Convoi);
        });

        return function cleanUp() {
            unsubscribe()
        };
    }, [id, user.project]);

    return convoi;
}


export default useConvoi;