import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Unsubscribe } from 'firebase/auth';
import { collection, doc, documentId, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { ChatRoom } from '../../../interfaces/ChatRoom';
import { IProfile } from '../../../interfaces/Profile';
import ChatRoomAvatar from '../../chatrooms/chatRoomAvatar';

interface NavChatRoomProps {
	chatRoomIds: string[] | undefined;
	profile: IProfile | undefined;
}

export default function NavChatRoomComponent({ chatRoomIds, profile }: NavChatRoomProps): JSX.Element {
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	useEffect(() => {
		if (chatRoomIds == null) return;
		if (chatRoomIds.length === 0) return;

		const unsubscribe = getChatRooms();
		return () => {
			unsubscribe();
		};
	}, [chatRoomIds]);

	function getChatRooms(): Unsubscribe {
		const chatRoomsRef = collection(db, 'chatRooms');
		const q = query(chatRoomsRef, where(documentId(), 'in', chatRoomIds));
		const unsubscribe = onSnapshot(q, (query) => {
			const chatRooms: ChatRoom[] = [];
			query.forEach((doc) => {
				const chatRoom: ChatRoom = {
					uid: doc.id,
					...(doc.data() as ChatRoom),
				};
				chatRooms.push(chatRoom);
			});
			setChatRooms(chatRooms);
		});
		return unsubscribe;
	}

	const onRemoveChatRoom = async (chatRoomUid: string | undefined): Promise<void> => {
		try {
			setChatRooms((prev) => prev.filter((chatRoom) => chatRoom.uid !== chatRoomUid));
			if (profile == null) return;
			console.log(profile, chatRoomUid);
			await updateDoc(doc(db, 'users', profile.uid), {
				chatRoomIds: profile.chatRoomIds.filter((chatRoomId) => chatRoomId !== chatRoomUid),
			});
		} catch (error) {
			console.log(error);
		}
	};

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
					<ChatRoomAvatar chatRoom={chatRoom} onRemoveChatRoom={onRemoveChatRoom} />
				</Box>
			))}
		</>
	);
}
