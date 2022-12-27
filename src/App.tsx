import RootComponent from './components/root/rootComponent';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router/routes';

function App() {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router} />;
}

export default App;
