import * as React from "react";
import getFirebase from "../../utils/getFirebase";
import {Navigate, useLocation} from "react-router-dom";
import Loading from "../loading";
import {onAuthStateChanged} from "firebase/auth";

interface LocationState {
    state: null | { from: { pathname: string } }
}

function RequireUnauth({children}: { children: JSX.Element}) {
    const [loading, setLoading] = React.useState(true);
    const [authenticated, setAuthenticated] = React.useState(false);
    const location = useLocation() as LocationState;

    React.useEffect(() => {
        const {auth} = getFirebase();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(false);
            if (user) setAuthenticated(true);
        });

        return function cleanUp() {
            unsubscribe();
        }
    },[])

    if (loading) return <Loading open={true} />;
    if (authenticated) return <Navigate to={location.state?.from || '/'} replace />;
    else return children;
}

export default RequireUnauth;