import * as React from "react";
import PropTypes, {InferProps} from "prop-types";
import {onAuthStateChanged, getIdTokenResult, signOut} from 'firebase/auth';
import getFirebase from "../../utils/getFirebase";

type User = {
    email?: string
    name?: string
    isAuthenticated: boolean
    loading: boolean,
    role?: 'driver' | 'orga' | 'admin'
}

const defaultUser = {
    loading: true,
    isAuthenticated: false,
}

const AuthContext = React.createContext<{ user: User, signout: () => void }>({
        user: defaultUser,
        signout: () => {
        }
    },
);

export const useAuth = () => React.useContext(AuthContext);

export function AuthProvider({children}: InferProps<typeof AuthProvider.propTypes>) {
    const [user, setUser] = React.useState(defaultUser);

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
                    provideEmailForLogin: false
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

    const signout = () => {
        const {auth} = getFirebase();
        window.localStorage.removeItem('emailForSignIn');
        signOut(auth);
    }

    return (
        <AuthContext.Provider value={{user, signout}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node
}

export default AuthProvider;