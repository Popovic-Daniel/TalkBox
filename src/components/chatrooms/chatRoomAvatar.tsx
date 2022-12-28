import { Clear } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../config/firebase';
import { ChatRoom } from '../../intefaces/ChatRoom';

export default function ({ chatRoom }: { chatRoom: ChatRoom }) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false);
	const onHandleRemoveChatRoom = () => {
		setIsRemoveDialogOpen(true);
	};
	const onRemoveChatRoom = async () => {
		setIsRemoveDialogOpen(false);
		try {
			const chatRoomRef = doc(db, 'chatRooms', chatRoom.uid);
			await deleteDoc(chatRoomRef);
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
				<Avatar sx={{ width: 40, height: 40, marginRight: '0.5em' }} alt={chatRoom.name} src={chatRoom.imageUrl} />
				<Typography>{chatRoom.name}</Typography>
				{/* remove chatroom icon */}
				<Tooltip
					title='Remove chatroom'
					sx={{
						marginLeft: 'auto',
						cursor: 'pointer',
						':hover': {
							color: 'red',
						},
					}}
				>
					<IconButton onClick={onHandleRemoveChatRoom}>
						<Clear
							sx={{
								visibility: isHovered ? 'visible' : 'hidden',
							}}
						/>
					</IconButton>
				</Tooltip>
				{/* dialog */}
			</Box>
			<Dialog open={isRemoveDialogOpen} onClose={() => setIsRemoveDialogOpen(false)}>
				<DialogTitle>Remove chatroom</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to remove this chatroom?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsRemoveDialogOpen(false)} sx={{ ':hover': { backgroundColor: '#2f2f2f' } }}>
						Cancel
					</Button>
					<Button
						onClick={onRemoveChatRoom}
						variant='contained'
						sx={{
							backgroundColor: 'red',
							color: 'white',
							':hover': {
								backgroundColor: '#b30000',
							},
						}}
					>
						Remove
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
