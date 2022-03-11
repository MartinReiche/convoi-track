import * as React from "react";
import Container from '@mui/material/Container';
import UserList from "../users/userList";
import AddOrganizer from "./addOrganizer";
import {collection, query, onSnapshot, deleteDoc, doc} from "firebase/firestore";
import getFirebase from "../../utils/getFirebase";
import Loading from "../loading";
import {useAuth} from "../auth/authProvider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader"
import Pagination from "@mui/material/Pagination"
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";

const PAGE_SIZE = 10;

interface User {
    email: string,
    name: string,
    id: string
}

export function Organizers() {
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState([] as User[]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [usersOnPage, setUsersOnPage] = React.useState<User[]>([]);
    const {user} = useAuth();

    React.useEffect(() => {
        const {db} = getFirebase();
        const q = query(collection(db, `/projects/${user.project}/orga`));
        const unsubscribe = onSnapshot(q, (snap) => {
            setLoading(false);
            const newUsers: User[] = [];
            snap.forEach(doc => {
                newUsers.push({...doc.data(), id: doc.id} as User);
            })
            setUsers(newUsers);
            setTotalPages(Math.ceil(newUsers.length / PAGE_SIZE));
        });
        return function cleanUp() {
            unsubscribe();
        }
    }, [user.project])

    React.useEffect(() => {
        setUsersOnPage(users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }, [users, page])

    const handlePageChange = (event: React.ChangeEvent<unknown>, currentPage: number) => {
        setPage(currentPage);
        changePage(currentPage);
    }

    const changePage = (page: number) => {
        setUsersOnPage(users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }

    const handleDeleteUser = async (id: string) => {
        const {db} = getFirebase();
        await deleteDoc(doc(db, `projects/${user.project}/orga`, id))
    }

    if (loading) return <Loading open={true}/>
    return (
        <Container maxWidth="md" sx={{pt: 5}}>
            <Card>
                <CardHeader title="Orgainzers"/>
                <UserList users={usersOnPage} deleteCallback={handleDeleteUser}/>
                <CardActions>
                    <Grid container sx={{
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row'},
                        alignItems: 'center'
                    }} >
                        <Grid item sx={{ mb: { xs: 3, sm: 0}}} >
                            {totalPages > 1 && (
                                <Pagination
                                    size="small"
                                    count={totalPages}
                                    siblingCount={0}
                                    onChange={handlePageChange}
                                />
                            )}
                        </Grid>
                        <Grid item >
                            {user.role === 'admin' && <AddOrganizer />}
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    )
}

export default Organizers;