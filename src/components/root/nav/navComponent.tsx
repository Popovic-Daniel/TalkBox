import { Person } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IProfile } from '../../../interfaces/Profile';
import NavChatRoomComponent from './navChatRoomComponent';

interface INavProps {
	chatRoomIds: string[] | undefined;
	profile: IProfile | undefined;
}

export default function NavComponent({ chatRoomIds, profile }: INavProps): JSX.Element {
	const navRoutes = [
		{
			name: 'Friends',
			path: '/friends',
			icon: <Person />,
		},
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '84vh', marginTop: '1em', opacity: 0.8 }}>
			{/* map over navRoutes and render a button for each route */}
			{navRoutes.map((route) => (
				<Link to={route.path} style={{ textDecoration: 'none', color: 'inherit' }} state={{ profile }} key={route.name}>
					<Button
						sx={{
							height: '6vh',
							color: 'inherit',
							':hover': {
								backgroundColor: '#2f2f2f',
								borderRadius: '0.5em',
							},
						}}
						fullWidth
					>
						<Stack spacing={0.5} direction='row'>
							{route.icon}
							<Typography fontWeight={700}> {route.name} </Typography>
						</Stack>
					</Button>
				</Link>
			))}
			<NavChatRoomComponent chatRoomIds={chatRoomIds} profile={profile} />
		</Box>
	);
}
