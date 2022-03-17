import {useTheme} from "@mui/material/styles";
import darkModeStyles from "./darkModeStyles";

export default function useMapColorModeStyles() {
    const theme = useTheme();
        return {
            mapStyles: theme.palette.mode === 'dark' ? darkModeStyles: [],
            mapBackgroundColor: theme.palette.background.default
        };
}

