import { createTheme } from '@mui/material/styles';

import { colors } from './tokens/colors';

export const getTheme = (mode: 'light' | 'dark') => {
  const currentColors = colors[mode];

  return createTheme({
    palette: {
      mode,

      primary: {
        main: currentColors.primary,
      },

      background: {
        default: currentColors.background,
        paper: currentColors.paper,
      },

      text: {
        primary: currentColors.text,
      },
    },

    typography: {
      fontFamily: 'Inter, sans-serif',
    },

    shape: {
      borderRadius: 12,
    },
  });
};