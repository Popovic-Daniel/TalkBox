import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    // schroll bar
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#2f3136 #292b2f',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#292b2f',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#2f3136',
                        borderRadius: '4px',
                        border: '3px solid #292b2f',
                    },
                },
            },
        },
    },


});
