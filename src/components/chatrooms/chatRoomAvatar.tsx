import { Clear } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import RemoveChatroomDialog from '../../dialogs/removeChatroomDialog';
import { ChatRoom } from '../../interfaces/ChatRoom';
import { IProfile } from '../../interfaces/Profile';

interface IChatRoomAvatarProps {
	chatRoom: ChatRoom;
	setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
	profile: IProfile | undefined;
}

export default function ({ chatRoom, setChatRooms, profile }: IChatRoomAvatarProps) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false);

	const onHandleRemoveChatRoom = () => {
		setIsRemoveDialogOpen(true);
	};
	const onRemoveChatRoom = async () => {
		setIsRemoveDialogOpen(false);
		try {
			setChatRooms((prev) => prev.filter((chatRoom) => chatRoom.uid !== chatRoom.uid));
			if (!profile) return;
			await updateDoc(doc(db, 'users', profile.uid), {
				chatRoomIds: profile.chatRoomIds.filter((chatRoomId) => chatRoomId !== chatRoom.uid),
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					padding: '0.5em',
					cursor: 'pointer',
					':hover': {
						backgroundColor: '#2f2f2f',
						borderRadius: '0.5em',
					},
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Link
					to='/chat'
					state={{ chatRoom: chatRoom }}
					style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%', alignItems: 'center' }}
				>
					<Avatar sx={{ width: 40, height: 40, marginRight: '0.5em' }} alt={chatRoom.name} src={chatRoom.imageUrl} />
					<Typography>{chatRoom.name}</Typography>
				</Link>
				{/* remove chatroom icon */}
				<Tooltip
					title='Remove chatroom'
					sx={{
						cursor: 'pointer',
						':hover': {
							color: 'red',
						},
					}}
					onClick={onHandleRemoveChatRoom}
					placement='right'
				>
					<IconButton>
						<Clear
							sx={{
								visibility: isHovered ? 'visible' : 'hidden',
							}}
						/>
					</IconButton>
				</Tooltip>
			</Box>

			<RemoveChatroomDialog onClose={() => setIsRemoveDialogOpen(false)} open={isRemoveDialogOpen} onRemoveChatRoom={onRemoveChatRoom} />
		</>
	);
}
