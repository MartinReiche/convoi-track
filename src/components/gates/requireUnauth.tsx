import * as React from "react";
import {Navigate, useLocation} from "react-router-dom";
import Loading from "../loading";
import {useAuth} from "../auth/authProvider";

interface LocationState {
    state: null | { from: { pathname: string } }
}

function RequireUnauth({children}: { children: JSX.Element}) {
    const {user} = useAuth();
    const location = useLocation() as LocationState;

    if (user.loading) return <Loading open={true} />;
    if (user.isAuthenticated) return <Navigate to={location.state?.from || '/'} replace />;
    else return children;
}

export default RequireUnauth;