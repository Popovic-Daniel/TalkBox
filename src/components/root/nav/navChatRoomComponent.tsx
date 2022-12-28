import { Add } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { ChatRoom } from '../../../intefaces/ChatRoom';
import ChatRoomAvatar from '../../chatrooms/chatRoomAvatar';

interface NavChatRoomProps {
	chatRoomIds: string[] | undefined;
}

export default function ({ chatRoomIds }: NavChatRoomProps) {
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>();
	useEffect(() => {
		if (!chatRoomIds) return;
		// if (chatRoomIds.length === 0) return;
		getChatRooms();
	}, [chatRoomIds]);

	async function getChatRooms() {
		const chatRoomsRef = collection(db, 'chatRooms');
		if (chatRoomIds?.length === 0) {
			setChatRooms([
				{
					uid: '1',
					name: 'test',
					memberIds: ['1', '2'],
					imageUrl: '',
					messages: [],
				},
				{
					uid: '2',
					name: 'test2',
					memberIds: ['1', '2'],
					imageUrl: '',
					messages: [],
				},
			]);
			return;
		}
		const q = query(chatRoomsRef, where('id', 'in', chatRoomIds));
		const docs = await getDocs(q);
		docs.forEach((doc) => {
			console.log(doc.id, ' => ', doc.data());
			setChatRooms((prev: any) => [...prev, doc.data() as ChatRoom]);
		});
	}

	return (
		<>
			<Box
				sx={{
					cursor: 'default',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography>Direct Messages</Typography>
				<IconButton
					sx={{
						':hover': {
							backgroundColor: '#2f2f2f',
							borderRadius: '0.5em',
						},
					}}
				>
					<Add />
				</IconButton>
			</Box>
			{chatRooms?.map((chatRoom) => (
				<Box key={chatRoom.uid}>
					<ChatRoomAvatar chatRoom={chatRoom} />
				</Box>
			))}
		</>
	);
}
