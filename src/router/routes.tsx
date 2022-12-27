import { RouteObject } from 'react-router-dom';
import Login from '../auth/login';
import Register from '../auth/register';
import RootComponent from '../components/root/rootComponent';
export const routes: RouteObject[] = [
	{
		path: '/',
		element: <RootComponent />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/register',
		element: <Register />,
	},
];
