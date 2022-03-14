import * as React from "react";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import getFirebase from "../utils/getFirebase";
import {httpsCallable} from 'firebase/functions';

export function AdminDashboard() {

    const handleClick = async () => {
        const {functions} = getFirebase();
        const createFixtures = httpsCallable(functions, "createFixtures");
        // TODO: handle errors
        await createFixtures({ message: 'Test'});
    }

    // TODO: Project creation, accessing projects as admin (without projectId in claims), admin creation
    return (
        <Container maxWidth="md" sx={{pt: 5}}>
            <Button onClick={handleClick}>Create Fixtures</Button>
        </Container>
    )
}

export default AdminDashboard;