import * as React from "react";
import {useAuth} from "../components/auth/authProvider";
import Dashboard from "./dashboard";

export function Home() {
    const {user} = useAuth();
    // welcome page for unauth
    if (user.role === 'driver') return <div>Home</div>
    if (user.role === 'admin' || user.role === 'orga') return <Dashboard />
    return null;
}

export default Home;