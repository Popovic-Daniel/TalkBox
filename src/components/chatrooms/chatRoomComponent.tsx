import { Send } from '@mui/icons-material';
import { Avatar, Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { doc, Unsubscribe, updateDoc } from 'firebase/firestore';
import { Dispatch, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createChatRoom, db, getChatRoomByMembers, getProfile } from '../../config/firebase';
import { ChatRoom } from '../../interfaces/ChatRoom';
import { IProfile } from '../../interfaces/Profile';
import { profileContext } from '../root/rootComponent';

export default function ChatRoomComponent(): JSX.Element {
	const [profile] = useContext<[IProfile | undefined, Dispatch<IProfile | undefined>]>(profileContext);
	const [friend, setFriend] = useState<IProfile>();
	const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>();
	const [message, setMessage] = useState<string>('');
	const data = useLocation();
	const navigate = useNavigate();
	const friendUid: string | null = data.state?.friendUid;
	const messagesEndRef = useRef<HTMLDivElement>(null);

	async function getChatRoom(): Promise<Unsubscribe | undefined> {
		if (friend == null) return;
		const memberIds = data.state?.chatRoom?.memberIds ?? [profile?.uid, friend.uid];
		let unsubscribe = getChatRoomByMembers(memberIds, setChatRoom);
		if (unsubscribe == null) {
			await createChatRoom(memberIds);
			unsubscribe = getChatRoomByMembers(memberIds, setChatRoom);
		}
		return unsubscribe;
	}

	function addMessage(): void {
		if (chatRoom === undefined) return;
		if (chatRoom.uid === undefined) return;
		if (profile === undefined) return;
		if (message.length === 0) return;
		const docRef = doc(db, 'chatRooms', chatRoom.uid);
		updateDoc(docRef, {
			messages: [
				...chatRoom.messages,
				{
					uid: Date.now().toString(),
					userId: profile.uid,
					text: message,
					timestamp: Date.now(),
				},
			],
		}).catch((error) => {
			console.log(error);
		});
		setMessage('');
	}

	useEffect(() => {
		if (data.state === null) {
			navigate('/');
			return;
		}
		if (profile === undefined) return;

		let unsubscribe: Unsubscribe | undefined;
		if (friendUid !== null) {
			unsubscribe = getProfile(friendUid, setFriend);
		} else if (data.state?.chatRoom === null) {
			unsubscribe = getProfile(
				data.state.chatRoom.memberIds.find((member: string) => member !== profile?.uid),
				setFriend
			);
		}
		if (chatRoom == null) return;
		if (chatRoom.uid === undefined) return;
		if (!profile.chatRoomIds.includes(chatRoom.uid)) navigate('/friends');
		return () => {
			if (unsubscribe !== undefined) unsubscribe();
		};
	}, [profile]);

	useEffect(() => {
		if (friend == null) return;
		getChatRoom()
			.then((unsubscribe) => {
				return () => {
					if (unsubscribe !== undefined) unsubscribe();
				};
			})
			.catch((error) => {
				console.log(error);
			});
	}, [friend]);

	useEffect(() => {
		if (chatRoom === undefined) return;
		// Scroll to bottom
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		if (chatRoom.uid === undefined) return;
		if (profile === undefined) return;
		if (profile.chatRoomIds.includes(chatRoom.uid)) return;

		const docRef = doc(db, 'users', profile?.uid);
		updateDoc(docRef, {
			chatRoomIds: [...profile?.chatRoomIds, chatRoom.uid],
		}).catch((error) => {
			console.log(error);
		});
	}, [chatRoom]);
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					overflow: 'auto',
					gap: 2,
					marginBottom: '1em',
				}}
			>
				{chatRoom?.messages.map((message) => (
					<Box key={message.uid} sx={{ display: 'flex', flexDirection: 'column' }} ref={messagesEndRef}>
						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
							<Avatar src={message.userId === profile?.uid ? profile?.avatar : friend?.avatar} />
							<Typography>{message.userId === profile?.uid ? profile?.name : friend?.name}</Typography>
							<Typography sx={{ opacity: 0.5 }}>{new Date(message.timestamp).toLocaleString()}</Typography>
						</Box>
						<Box
							sx={{
								marginLeft: '3em',
								opacity: 0.8,
							}}
						>
							<Typography>{message.text}</Typography>
						</Box>
					</Box>
				))}
			</Box>
			<TextField
				sx={{
					marginTop: 'auto',
					padding: 1,
					width: '100%',
				}}
				placeholder='Type your message here'
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						addMessage();
					}
				}}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				// send icon on the right
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton onClick={addMessage} edge='start' aria-label='send' sx={{ color: 'primary.main' }}>
								<Send />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</Box>
	);
	// how would i add autoscroll
	// A: https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
}
