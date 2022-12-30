import { ChatBubbleRounded, MoreVert } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { IProfile } from '../../interfaces/Profile';
import { profileContext } from '../root/rootComponent';

interface IFiendOptionsProps {
	friendUid: string;
}

export default function FriendOptionsComponent({ friendUid }: IFiendOptionsProps): JSX.Element {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const [profile] = useContext<[IProfile | undefined, Dispatch<SetStateAction<IProfile | undefined>>]>(profileContext);

	const removeFriend = (): void => {
		if (profile == null) return;
		profile.friendIds = profile.friendIds?.filter((id) => id !== friendUid);
		updateDoc(doc(db, 'users', profile?.uid), {
			friendIds: profile.friendIds?.filter((id) => id !== friendUid),
		}).catch((error) => {
			console.log(error);
		});
		setAnchorEl(null);
	};

	return (
		<Box sx={{ display: 'flex', gap: 5, p: 1 }}>
			<Tooltip title='open chat' key='openChat'>
				<Link to={'/chat'} state={{ friendUid }}>
					<IconButton>
						<ChatBubbleRounded />
					</IconButton>
				</Link>
			</Tooltip>
			<Tooltip title='more' key='moreOptions'>
				<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
					<MoreVert />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
				<MenuItem
					sx={{
						color: 'red',
					}}
					onClick={() => removeFriend}
				>
					Remove Friend
				</MenuItem>
			</Menu>
		</Box>
	);
}
