import * as React from "react";
import Container from '@mui/material/Container';
import Organizers from "../components/organizers";
import {useAuth} from "../components/auth/authProvider";
import Convois from "../components/convois";

export function ProjectDashboard() {
    const {user} = useAuth();

    return (
        <Container maxWidth="md" sx={{pt: 5}}>
            {(user.role === 'project-admin' || user.role === 'orga') && <Convois />}
            {user.role === 'project-admin' && <Organizers />}
        </Container>
    )
}

export default ProjectDashboard;