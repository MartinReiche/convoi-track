import * as React from "react";
import Container from '@mui/material/Container';
import {collection, query, onSnapshot, Timestamp} from "firebase/firestore";
import getFirebase from "../../utils/getFirebase";
import Loading from "../loading";
import {useAuth} from "../auth/authProvider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader"
import Pagination from "@mui/material/Pagination"
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import {GeoPoint} from 'firebase/firestore';
import ConvoiCard from "./convoiCard";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {grey} from "@mui/material/colors";

const PAGE_SIZE = 4;

interface Convoi {
    id: string,
    name: string,
    etd: Timestamp,
    eta: Timestamp,
    to: GeoPoint
}

export function Convois() {
    const [loading, setLoading] = React.useState(true);
    const [convois, setConvois] = React.useState([] as Convoi[]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [convoisOnPage, setConvoisOnPage] = React.useState<Convoi[]>([]);
    const {user} = useAuth();

    React.useEffect(() => {
        const {db} = getFirebase();
        const q = query(collection(db, `/projects/${user.project}/convois`));
        const unsubscribe = onSnapshot(q, (snap) => {
            setLoading(false);
            const newConvois: Convoi[] = [];
            snap.forEach(doc => {
                newConvois.push({...doc.data(), id: doc.id} as Convoi);
            })
            setConvois(newConvois);
            setTotalPages(Math.ceil(newConvois.length / PAGE_SIZE));
        });
        return function cleanUp() {
            unsubscribe();
        }
    }, [user.project])

    React.useEffect(() => {
        setConvoisOnPage(convois.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }, [convois, page])

    const handlePageChange = (event: React.ChangeEvent<unknown>, currentPage: number) => {
        setPage(currentPage);
        changePage(currentPage);
    }

    const changePage = (page: number) => {
        setConvoisOnPage(convois.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }

    if (loading) return <Loading open={true}/>
    return (
        <Container maxWidth="md" sx={{pt: 5}}>
            <Card sx={(theme) => ({ backgroundColor: theme.palette.mode === 'dark' ? grey[900] : grey[200] })}>
                <CardHeader title="Manage Convoys"/>
                <CardContent>
                    <Stack spacing={2}>
                        {convoisOnPage.map((convoi) => (
                            <ConvoiCard key={convoi.id} convoi={convoi} />
                        ))}
                    </Stack>
                </CardContent>
                <CardActions>
                    <Grid container sx={{
                        justifyContent: 'space-between',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: 'center'
                    }}>
                        <Grid item sx={{mb: {xs: 3, sm: 0}}}>
                            {totalPages > 1 && (
                                <Pagination
                                    size="small"
                                    count={totalPages}
                                    siblingCount={0}
                                    onChange={handlePageChange}
                                />
                            )}
                        </Grid>
                        <Grid item>
                            {user.role === 'admin' && (
                                <Link to={`/convoys/new`} style={{textDecoration: 'none'}}>
                                    <Button variant="contained">Add Convoy</Button>
                                </Link>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    )
}

export default Convois;