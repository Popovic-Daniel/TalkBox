import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Dispatch, useContext, useState } from 'react';
import { Message } from '../../interfaces/Message';
import { IProfile } from '../../interfaces/Profile';
import { profileContext } from '../root/rootComponent';

interface IMessageProps {
	message: Message;
}

export default function MessageComponent({ message }: IMessageProps): JSX.Element {
	const [hover, setHover] = useState<boolean>(false);
	const [profile] = useContext<[IProfile | undefined, Dispatch<IProfile | undefined>]>(profileContext);
	function getLocalTimeString(): string {
		const format = new Intl.DateTimeFormat('en', {
			hour: 'numeric',
			minute: 'numeric',
		});
		const time = new Date(message.timestamp);
		const [{ value: hour }, _, { value: minute }] = format.formatToParts(time);
		return `${hour}:${minute} ${time.getHours() < 12 ? 'am' : 'pm'}`;
	}

	return (
		<Box
			key={message.uid}
			sx={{
				display: 'flex',
				gap: 1,
				alignItems: 'center',
				borderRadius: '0.2em',
				padding: '0.2em',
				':hover': {
					backgroundColor: '#2f2f2f',
				},
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<Typography sx={{ opacity: '0.5', fontSize: '0.85em' }} visibility={hover ? 'visible' : 'hidden'}>
				{getLocalTimeString()}
			</Typography>
			<Typography>{message.text}</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: 1,
					alignItems: 'center',
					marginLeft: 'auto',
					visibility: hover ? 'visible' : 'hidden',
				}}
			>
				{/* edit button */}
				{/* delete button */}
				{profile?.uid === message.userId && (
					<Box>
						<Tooltip title='Edit message'>
							<IconButton edge='start' aria-label='edit'>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip title='Delete message'>
							<IconButton edge='start' aria-label='delete'>
								<Delete />
							</IconButton>
						</Tooltip>
					</Box>
				)}
			</Box>
		</Box>
	);
}
