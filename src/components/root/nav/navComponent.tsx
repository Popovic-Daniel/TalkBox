import { Box, Button, Stack, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import NavChatRoomComponent from './navChatRoomComponent';
export default function ({ chatRoomIds }: { chatRoomIds: string[] | undefined }) {
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
				<Button
					sx={{
						height: '6vh',
						color: 'inherit',
						':hover': {
							backgroundColor: '#2f2f2f',
							borderRadius: '0.5em',
						},
					}}
					key={route.name}
				>
					<Link to={route.path} style={{ textDecoration: 'none', color: 'inherit' }}>
						<Stack spacing={0.5} direction='row'>
							{route.icon}
							<Typography fontWeight={700}> {route.name} </Typography>
						</Stack>
					</Link>
				</Button>
			))}
			<NavChatRoomComponent chatRoomIds={chatRoomIds} />
		</Box>
	);
}
