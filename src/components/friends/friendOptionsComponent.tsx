import { ChatBubbleRounded, MoreVert } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';

export default function () {
	return (
		<Box sx={{ display: 'flex', gap: 5, p: 1 }}>
			<Tooltip title='open chat' key='openChat'>
				<IconButton>
					<ChatBubbleRounded />
				</IconButton>
			</Tooltip>
			<Tooltip title='more' key='moreOptions'>
				<IconButton>
					<MoreVert />
				</IconButton>
			</Tooltip>
		</Box>
	);
}
