import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {ColorModeContext} from "./index";

export default function ToggleColorMode() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (

      <IconButton sx={{ mr: 1 }} onClick={colorMode.toggleColorMode} color="inherit" size="large">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
  )

}
