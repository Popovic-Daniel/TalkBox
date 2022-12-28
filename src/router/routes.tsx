import { RouteObject } from 'react-router-dom';
import Login from '../auth/login';
import Register from '../auth/register';
import RootComponent from '../components/root/rootComponent';
export const routes: RouteObject[] = [
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{
				path: '/friends',
				element: <div>Friends</div>,
			},
		],
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
