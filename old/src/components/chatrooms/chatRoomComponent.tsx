import { Send } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { doc, Unsubscribe, updateDoc } from 'firebase/firestore';
import { Dispatch, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createChatRoom, db, getChatRoomByMembers, getProfile } from '../../config/firebase';
import { ChatRoom } from '../../interfaces/ChatRoom';
import { Message } from '../../interfaces/Message';
import { IProfile } from '../../interfaces/Profile';
import { profileContext } from '../root/rootComponent';
import MessageComponent from './messageComponent';

interface ICombinedMessage {
	profile: IProfile | undefined;
	timestamp: number;
	messages: Message[];
	isOnTheNextDay: boolean;
}

export default function ChatRoomComponent(): JSX.Element {
	const [profile] = useContext<[IProfile | undefined, Dispatch<IProfile | undefined>]>(profileContext);
	const [friend, setFriend] = useState<IProfile>();
	const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>();
	const [combinedMessages, setCombinedMessages] = useState<ICombinedMessage[]>([]);
	const [message, setMessage] = useState<string>('');
	const data = useLocation();
	const navigate = useNavigate();
	const friendUid: string | undefined = data.state?.friendUid;
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

	function combineMessages(): void {
		const combinedMessages: ICombinedMessage[] = [];
		let isOnTheNextDay: boolean = false;
		let previousMessage: Message | undefined;
		if (chatRoom === undefined) return;
		if (profile === undefined) return;
		chatRoom.messages.forEach((message) => {
			if (previousMessage === undefined) {
				combinedMessages.push({
					profile: message.userId === profile?.uid ? profile : friend,
					timestamp: message.timestamp,
					messages: [message],
					isOnTheNextDay: true,
				});
				previousMessage = message;
				return;
			}
			if (message.userId === previousMessage.userId) {
				if (isOnTheNextDay) {
					combinedMessages.push({
						profile: message.userId === profile?.uid ? profile : friend,
						timestamp: message.timestamp,
						messages: [message],
						isOnTheNextDay,
					});
				} else {
					combinedMessages[combinedMessages.length - 1].messages.push(message);
				}
			} else {
				combinedMessages.push({
					profile: message.userId === profile?.uid ? profile : friend,
					timestamp: message.timestamp,
					messages: [message],
					isOnTheNextDay,
				});
			}

			if (message.timestamp === undefined) return;
			isOnTheNextDay = new Date(message.timestamp).getDate() !== new Date(previousMessage.timestamp).getDate();
			previousMessage = message;
		});
		setCombinedMessages(combinedMessages);
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
		if (friendUid !== undefined) {
			unsubscribe = getProfile(friendUid, setFriend);
		} else if (data.state?.chatRoom !== undefined) {
			unsubscribe = getProfile(
				data.state.chatRoom.memberIds.find((member: string) => member !== profile?.uid),
				setFriend
			);
		}
		if (chatRoom === undefined) return;
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
		if (chatRoom.uid === undefined) return;
		if (profile === undefined) return;
		combineMessages();
		if (profile.chatRoomIds.includes(chatRoom.uid)) return;

		const docRef = doc(db, 'users', profile?.uid);
		updateDoc(docRef, {
			chatRoomIds: [...profile?.chatRoomIds, chatRoom.uid],
		}).catch((error) => {
			console.log(error);
		});
		// combine messages
	}, [chatRoom]);
	useEffect(() => {
		if (combinedMessages.length === 0) return;
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [combinedMessages]);
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
				{combinedMessages.map((combinedMessage) => (
					<Box key={combinedMessage.timestamp} sx={{ display: 'flex', flexDirection: 'column' }} ref={messagesEndRef}>
						{/* divider with timestamp in the middle */}
						{combinedMessage.isOnTheNextDay && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 1,
									margin: '1em',
								}}
							>
								<Divider sx={{ width: '100%' }}>
									<Typography sx={{ opacity: 0.5 }}>{new Date(combinedMessage.timestamp).toLocaleString()}</Typography>
								</Divider>
							</Box>
						)}

						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
							<Avatar src={combinedMessage?.profile?.avatar} />
							<Typography>{combinedMessage?.profile?.name}</Typography>
							<Typography sx={{ opacity: 0.5 }}>{new Date(combinedMessage.timestamp).toLocaleString()}</Typography>
						</Box>
						<Box
							sx={{
								opacity: 0.8,
							}}
						>
							{combinedMessage.messages.map((message) => (
								<MessageComponent key={message.uid} message={message} />
							))}
						</Box>
					</Box>
				))}
			</Box>
			<TextField
				sx={{
					marginTop: 'auto',
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
}
