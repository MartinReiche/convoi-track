import * as React from "react";
import {useLocation, Navigate} from "react-router-dom";
import Loading from "../loading";
import {useAuth} from "../auth/authProvider";
import getFirebase from "../../utils/getFirebase";
import {isSignInWithEmailLink} from "firebase/auth";
import ConfirmLogin from "../../pages/confirmLogin";
import RequireUnauth from "./requireUnauth";

function RequireAuth({children, roles}: { children: JSX.Element, roles: string[] }) {
    const {user} = useAuth();
    const location = useLocation();
    const {auth} = getFirebase();


    // show loading spinner if user is not yet loaded
    if (user.loading) return <Loading open={true} />;

    if (isSignInWithEmailLink(auth, window.location.href)) {
        return (
            <RequireUnauth>
                <ConfirmLogin />
            </RequireUnauth>
        );
    }
    // redirect to login screen
    if (!user.isAuthenticated || !roles.includes(user.role || '')) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    // let user pass
    if (user.isAuthenticated && roles.includes(user.role || '')) return children;
    return null;
}

export default RequireAuth;