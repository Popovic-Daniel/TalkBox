import { ExitToAppOutlined, Person, Settings } from '@mui/icons-material';
import {
	Avatar,
	Box,
	Button,
	Divider,
	IconButton,
	Input,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth, logout } from '../../config/firebase';

export default function RootComponent() {
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		console.log('user', user);
		if (loading) return;
		if (!user) navigate('/login');
	}, [user, loading]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleLogout = () => {
		logout();
		onClose();
	};
	const onClose = () => {
		setAnchorEl(null);
	};

	// nav which ist 1/5 of the screen horizontally
	// the rest is the content
	// on the bottom of the nav should be an avatar with the username
	// when clicking on the avatar, a dropdown should appear with logout
	// when clicking on logout, the user should be logged out and navigated to login
	// the styling should be made with mui
	return (
		<Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
			<Box sx={{ display: 'flex', height: '100vh', width: '30vh', flexDirection: 'column', padding: 2, bgcolor: '#1a1a1a' }}>
				<Box sx={{ display: 'flex', height: '8vh' }}>
					{/* search bar which opens a dialog => is just a dummy*/}
					<Box
						sx={{
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							bgcolor: '#121212',
							width: '100%',
							marginBottom: '1em',
							borderRadius: '0.5em',
							opacity: 0.6,
						}}
					>
						<Typography>Search</Typography>
					</Box>
				</Box>
				<Divider />
				<Box sx={{ display: 'flex', flexDirection: 'column', height: '84vh', marginTop: '1em' }}>
					{/* person icon with friends Text */}
					<Button sx={{ height: '10%' }}>
						<Link
							to='/friends'
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							<Stack spacing={0.5} direction='row'>
								<Person />
								<Typography fontWeight={700}> Friends </Typography>
							</Stack>
						</Link>
					</Button>
				</Box>
				<Divider />
				<Box
					sx={{
						display: 'flex',
						gap: 2,
						flexDirection: 'row',
						height: '8vh',
						alignItems: 'center',
					}}
				>
					<Button
						id='menu-button'
						aria-controls={open ? 'menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
						sx={{ height: '100%', width: '100%', gap: 1, justifyContent: 'flex-start' }}
					>
						<Avatar variant='rounded' src={user?.photoURL?.toString()} />
						<Stack spacing={0.5}>
							<Typography fontWeight={700}> {user?.displayName} </Typography>
						</Stack>
					</Button>
					<Menu
						id='menu'
						anchorEl={anchorEl}
						open={open}
						onClose={onClose}
						MenuListProps={{
							'aria-labelledby': 'menu-button',
						}}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								{/* Logout */}
								<IconButton aria-label='logout' color='inherit'>
									<ExitToAppOutlined />
								</IconButton>
							</ListItemIcon>
							<ListItemText primary='Logout' />
						</MenuItem>
					</Menu>
					<Tooltip title='Settings'>
						<IconButton>
							<Settings />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', height: '100vh', width: '100%', padding: 2 }}>
				{/* mui transition */}
				<Outlet />
			</Box>
		</Box>
	);
}
