import { Clear } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveChatroomDialog from '../../dialogs/removeChatroomDialog';
import { ChatRoom } from '../../interfaces/ChatRoom';

interface IChatRoomAvatarProps {
	chatRoom: ChatRoom;
	onRemoveChatRoom: (chatRoomUid: string | undefined) => Promise<void>;
}

export default function ChatRoomAvatar({ chatRoom, onRemoveChatRoom }: IChatRoomAvatarProps): JSX.Element {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false);

	const onHandleRemoveChatRoom = (): void => {
		setIsRemoveDialogOpen(true);
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
					state={{ chatRoom }}
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

			<RemoveChatroomDialog
				onClose={() => setIsRemoveDialogOpen(false)}
				open={isRemoveDialogOpen}
				onRemoveChatRoom={() => {
					setIsRemoveDialogOpen(false);
					void onRemoveChatRoom(chatRoom?.uid);
				}}
			/>
		</>
	);
}
