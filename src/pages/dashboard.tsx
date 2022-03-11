import * as React from "react";
import Container from '@mui/material/Container';
import Organizers from "../components/organizers";
import {useAuth} from "../components/auth/authProvider";

export function Dashboard() {
    const {user} = useAuth();

    return (
        <Container maxWidth="md" sx={{pt: 5}}>
            {user.role === 'admin' && <Organizers />}
        </Container>
    )
}

export default Dashboard;