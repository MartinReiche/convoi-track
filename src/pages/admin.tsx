import * as React from "react";
import Container from '@mui/material/Container';
import UserList from "../components/users/userList";
import Typography from "@mui/material/Typography";
import AddUser from "../components/users/addUser";
import Box from '@mui/material/Box';
import {collection, query, onSnapshot, deleteDoc, doc} from "firebase/firestore";
import getFirebase from "../utils/getFirebase";
import Loading from "../components/loading";

interface User {
    email: string,
    name: string,
    id: string
}


export function Admin() {
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState([] as User[]);

    React.useEffect(() => {
        const {db} = getFirebase();
        const q = query(collection(db, 'orga'));
        const unsubscribe = onSnapshot(q, (snap) => {
            setLoading(false);
            const newUsers: User[] = [];
            snap.forEach(doc => {
                newUsers.push({...doc.data(), id: doc.id} as User);
            })
            setUsers(newUsers);
        });
        return function cleanUp() {
            unsubscribe();
        }
    }, [])

    const handleDeleteUser = async (id: string) => {
        const {db} = getFirebase();
        await deleteDoc(doc(db,'orga', id))
    }

    if (loading) return <Loading open={true} />
    return (
        <Container maxWidth="md" sx={{ pt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb:3, mt: 2, flexWrap: 'wrap' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    color="secondary"
                    sx={{ fontWeight: 'bold' }}
                >
                    Organizers
                </Typography>
                <AddUser />
            </Box>
            <UserList users={users} deleteCallback={handleDeleteUser} />
        </Container>
    )
}

export default Admin;