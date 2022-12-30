import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface IRemoveChatroomDialogProps {
	open: boolean;
	onClose: () => void;
	onRemoveChatRoom: () => void;
}

export default function RemoveChatroomDialog({ open, onClose, onRemoveChatRoom }: IRemoveChatroomDialogProps): JSX.Element {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Remove chatroom</DialogTitle>
			<DialogContent>
				<Typography>Are you sure you want to remove this chatroom?</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ ':hover': { backgroundColor: '#2f2f2f' } }}>
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
	);
}
