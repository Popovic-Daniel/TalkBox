import { ExitToAppOutlined, Settings } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { logout } from '../../../config/firebase';
import { IProfile } from '../../../intefaces/Profile';
import ProfileItemsComponent from './profileItemsComponent';

interface ProfilePros {
	profile: IProfile | undefined;
}

export default function ProfileComponent({ profile }: ProfilePros) {
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

	return (
		<Box
			sx={{
				display: 'flex',
				gap: 2,
				flexDirection: 'row',
				height: '8vh',
				alignItems: 'center',
				marginTop: '1em',
			}}
		>
			<Button
				id='menu-button'
				aria-controls={open ? 'menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{
					height: '100%',
					width: '100%',
					gap: 1,
					justifyContent: 'flex-start',
					':hover': {
						backgroundColor: '#2f2f2f',
						borderRadius: '0.5em',
					},
				}}
			>
				<Avatar variant='rounded' src={profile?.avatar?.toString()} />
				<Stack spacing={0.5}>
					<Typography fontWeight={700}> {profile?.name} </Typography>
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
						<IconButton aria-label='logout' color='inherit'>
							<ExitToAppOutlined />
						</IconButton>
					</ListItemIcon>
					<ListItemText primary='Logout' />
				</MenuItem>
			</Menu>
			<ProfileItemsComponent />
		</Box>
	);
}
