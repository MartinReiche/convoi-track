import * as React from "react";
import Container from '@mui/material/Container';
import {collection, query, onSnapshot} from "firebase/firestore";
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
import AddConvoi from "./addConvoi";
import {GeoPoint} from 'firebase/firestore';
import ConvoiCard from "./convoiCard";

const PAGE_SIZE = 4;

interface Convoi {
    id: string,
    name: string,
    etd: Date,
    eta: Date,
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
            <Card>
                <CardHeader title="Convoys"/>
                <CardContent>
                    <Stack spacing={2}>
                        {convoisOnPage.map((convoi, index) => (
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
                            {user.role === 'admin' && <AddConvoi/>}
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    )
}

export default Convois;