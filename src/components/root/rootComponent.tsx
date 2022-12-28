import { Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, getProfile } from '../../config/firebase';
import { IProfile } from '../../intefaces/Profile';
import NavComponent from './nav/navComponent';
import ProfileComponent from './profile/profileComponent';
import SearchComponent from './searchComponent';

export default function RootComponent() {
	const [user, loading, error] = useAuthState(auth);
	const [profile, setProfile] = useState<IProfile>();
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (!user) {
			navigate('/login');
			return;
		}
		getProfile(user.uid, setProfile);
	}, [user, loading]);

	return (
		<Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
			<Box sx={{ display: 'flex', height: '100vh', width: '30vh', flexDirection: 'column', padding: 2, bgcolor: '#1a1a1a' }}>
				<SearchComponent />
				<Divider />
				<NavComponent chatRoomIds={profile?.chatRoomIds} />
				<Divider />
				<ProfileComponent profile={profile} />
			</Box>

			<Box sx={{ display: 'flex', height: '100vh', width: '100%', padding: 2 }}>
				<Outlet />
			</Box>
		</Box>
	);
}
