import * as React from "react";
import getFirebase from "../../utils/getFirebase";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import Loading from "../loading";
import {onAuthStateChanged} from "firebase/auth";

interface LocationState {
    state: null | { from: { pathname: string } }
}

function RequireUnauth({children}: { children: JSX.Element}) {
    const [loading, setLoading] = React.useState(true);
    const location = useLocation() as LocationState;
    const navigate = useNavigate();

    React.useEffect(() => {
        const {auth} = getFirebase();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(false);
            if (user) {
                if (location.state?.from) {
                    navigate(location.state.from.pathname)
                } else {
                    navigate('/');
                }
            }
        })

        return function cleanUp() {
            unsubscribe();
        }

    },[location.state?.from, navigate])

    if (loading) return <Loading open={true} />
    return children;
}

export default RequireUnauth;