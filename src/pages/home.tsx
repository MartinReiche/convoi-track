import * as React from "react";
import {useAuth} from "../components/auth/authProvider";
import ProjectDashboard from "./projectDashboard";
import AdminDashboard from "./adminDashboard";

export function Home() {
    const {user} = useAuth();
    if (user.role === 'driver') return <div>Home</div>
    if (user.role === 'project-admin' || user.role === 'orga') return <ProjectDashboard />
    if (user.role === 'admin') return <AdminDashboard />
    return null;
}

export default Home;