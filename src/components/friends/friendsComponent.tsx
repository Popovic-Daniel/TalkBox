import { Chat, ChatBubble, ChatBubbleRounded, More, MoreVert } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, getProfile } from '../../config/firebase';
import { IProfile } from '../../interfaces/Profile';
import FriendOptionsComponent from './friendOptionsComponent';

export default function () {
	const data = useLocation();
	const [profile, setProfile] = useState<IProfile>();
	const [user, loading, error] = useAuthState(auth);
	const [friends, setFriends] = useState<IProfile[]>([
		{
			avatar: '',
			name: 'John',
			uid: '123',
			authProvider: 'google',
			chatRoomIds: [],
			friendIds: [],
			email: 'john@gmail.com',
		},
		{
			avatar: '',
			name: 'Jeff',
			uid: '223',
			authProvider: 'google',
			chatRoomIds: [],
			friendIds: [],
			email: 'jeff@gmail.com',
		},
	]);
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (!user) {
			navigate('/login');
			return;
		}
		if (!data.state?.profile) {
			getProfile(user.uid).then((profile: unknown) => {
				setProfile(profile as IProfile);
			});
		} else {
			setProfile(data.state.profile);
		}

		// getFriends();
	}, [user, loading]);

	async function getFriends() {
		const friendIds: string[] = profile?.friendIds || [];
		const friends: IProfile[] = [];
		for (const friendId of friendIds) {
			const friend = await getProfile(friendId);
			if (friend) friends.push(friend);
		}
		setFriends(friends);
	}

	return (
		// use mui for styling
		// just display the friends, nav is already in rootComponent

		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			{friends?.map((friend) => (
				<Box sx={{ display: 'flex', flexDirection: 'column', height: 64 }} key={friend.uid}>
					<Divider
						sx={{
							marginLeft: '0.5em',
							marginRight: '0.5em',
						}}
					/>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							p: 1,
							':hover': {
								backgroundColor: '#1a1a1a',
							},
							cursor: 'pointer',
							borderRadius: '0.5em',
							height: '100%',
							gap: 1,
						}}
					>
						<Avatar src={friend.avatar} />
						<Typography>{friend.name}</Typography>
						<Box sx={{ flexGrow: 1 }} />
						<FriendOptionsComponent />
					</Box>
				</Box>
			))}
		</Box>
	);
}
