import { createTheme } from '@mui/material'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  // scroll bar
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '&::-webkit-scrollbar': {
          width: '1em',
          backgroundColor: '#2f2f2f',
          borderRadius: '1em',
          padding: '0.5em',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#1a1a1a',
          borderRadius: '1em',
          backgroundClip: 'padding-box',
          border: '0.2em solid transparent',
        },
      },
    },
  },

})
