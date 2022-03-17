import * as React from "react";
import PropTypes, {InferProps} from "prop-types";
import {onAuthStateChanged, getIdTokenResult, signOut} from 'firebase/auth';
import getFirebase from "../../utils/getFirebase";

type Role = 'driver' | 'orga' | 'project-admin' | 'admin';

type User = {
    email?: string
    name?: string
    isAuthenticated: boolean
    loading: boolean
    role?: Role
    project?: string
    convoi?: string
    car?: string
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
    const [user, setUser] = React.useState<User>(defaultUser);

    React.useEffect(() => {
        const {auth} = getFirebase();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await getIdTokenResult(user);
                setUser({
                    email: user.email as string,
                    name: user.displayName as string,
                    isAuthenticated: true,
                    role: idTokenResult.claims.role as Role,
                    project: idTokenResult.claims.project as string,
                    convoi: idTokenResult.claims.convoi as string,
                    car: idTokenResult.claims.car as string,
                    loading: false,
                });
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