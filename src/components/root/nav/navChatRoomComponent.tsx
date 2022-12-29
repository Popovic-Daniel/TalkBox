import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { ChatRoom } from '../../../interfaces/ChatRoom';
import { Message } from '../../../interfaces/Message';
import { IProfile } from '../../../interfaces/Profile';
import ChatRoomAvatar from '../../chatrooms/chatRoomAvatar';

interface NavChatRoomProps {
	chatRoomIds: string[] | undefined;
	profile: IProfile | undefined;
}

export default function ({ chatRoomIds, profile }: NavChatRoomProps) {
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
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
					imageUrl: '',
					memberIds: [],
					messages: [
						{
							uid: '1',
							text: 'test',
							timestamp: new Date().getTime(),
							userId: profile?.uid,
						},
						{
							uid: '2',
							text: 'test',
							timestamp: new Date().getTime(),
							userId: '1',
						},
					],
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
				<Tooltip title='new direct message' placement='right'>
					<IconButton>
						<Add />
					</IconButton>
				</Tooltip>
			</Box>
			{chatRooms?.map((chatRoom) => (
				<Box key={chatRoom.uid}>
					<ChatRoomAvatar chatRoom={chatRoom} setChatRooms={setChatRooms} profile={profile} />
				</Box>
			))}
		</>
	);
}
