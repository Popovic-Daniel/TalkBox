import { Avatar, Box, Divider, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFriends } from '../../config/firebase';
import { IProfile } from '../../interfaces/Profile';
import { profileContext } from '../root/rootComponent';
import FriendOptionsComponent from './friendOptionsComponent';

export default function FriendsComponent(): JSX.Element {
	const [profile] = useContext<[IProfile | undefined, React.Dispatch<IProfile> | undefined]>(profileContext);
	const [friends, setFriends] = useState<IProfile[]>();
	useEffect(() => {
		if (profile === undefined) return;
		if (profile.friendIds.length === 0) return;
		const unsubscribe = getFriends(profile.friendIds, setFriends);
		return () => {
			if (unsubscribe != null) unsubscribe();
		};
	}, [profile]);

	return (
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
						}}
					>
						<Link
							to={'/chat'}
							state={{ friendUid: friend.uid }}
							style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1em', width: '100%' }}
						>
							<Avatar src={friend.avatar} />
							<Typography>{friend.name}</Typography>
						</Link>
						<Box sx={{ flexGrow: 1 }} />
						<FriendOptionsComponent friendUid={friend.uid} />
					</Box>
				</Box>
			))}
		</Box>
	);
}
