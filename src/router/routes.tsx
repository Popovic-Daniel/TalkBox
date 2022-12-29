import { RouteObject } from 'react-router-dom';
import Login from '../auth/login';
import Register from '../auth/register';
import ChatRoomComponent from '../components/chatrooms/chatRoomComponent';
import FriendsComponent from '../components/friends/friendsComponent';
import RootComponent from '../components/root/rootComponent';
export const routes: RouteObject[] = [
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{
				path: '/friends',
				element: <FriendsComponent />,
			},
			{
				path: '/chat',
				element: <ChatRoomComponent />,
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
