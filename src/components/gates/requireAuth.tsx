import * as React from "react";
import getFirebase from "../../utils/getFirebase";
import {onAuthStateChanged, getIdTokenResult} from 'firebase/auth';
import {useLocation, Navigate} from "react-router-dom";
import Loading from "../loading";

const defaultUser = {
    email: '',
    name: '',
    role: '',
    loading: true,
    isAuthenticated: false,
}

function RequireAuth({children, roles}: { children: JSX.Element, roles: string[] }) {
    const [user, setUser] = React.useState(defaultUser);
    const location = useLocation();

    React.useEffect(() => {
        const {auth} = getFirebase();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await getIdTokenResult(user);
                const userState = {
                    email: user.email as string,
                    name: user.displayName as string,
                    isAuthenticated: true,
                    role: idTokenResult.claims.role as string,
                    loading: false,
                };
                setUser(userState);
            } else {
                setUser({...defaultUser, loading: false});
            }
        })

        return function cleanUp() {
            unsubscribe();
        }
    }, [])

    // show loading spinner if user is not yet loaded
    if (user.loading) return <Loading open={true} />;
    // redirect to login screen
    if (!user.isAuthenticated || !roles.includes(user.role)) {
        console.log(location)
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    // let user pass
    if (user.isAuthenticated && roles.includes(user.role)) return children;
    return null;
}

export default RequireAuth;