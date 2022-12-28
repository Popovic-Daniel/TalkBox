import RootComponent from './components/root/rootComponent';
import { Route, Router, Routes } from 'react-router-dom';
import { routes } from './router/routes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme/darktheme';

function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			{/* add transitions when switching between pages using framer-motion library*/}

			<Routes>
				{routes.map((route) => (
					<Route key={route.path} path={route.path} element={route.element}></Route>
				))}
			</Routes>
		</ThemeProvider>
	);
}

export default App;
