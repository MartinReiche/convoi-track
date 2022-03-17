import * as React from "react";
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate} from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();
    return (
        <Container maxWidth="md" sx={{ pt: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 'bold' }}
                >
                    404 - Not Found. Hmm... There is nothing here.
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        sx={{mt: 8}}
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>

        </Container>
    )
}

export default NotFound;