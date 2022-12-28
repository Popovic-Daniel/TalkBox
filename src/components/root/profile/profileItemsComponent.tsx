import { Settings } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export default function () {
	const items = [
		{
			name: 'settings',
			path: '/settings',
			icon: <Settings />,
		},
	];

	return (
		<>
			{items.map((item) => (
				<Tooltip
					title={item.name}
					key={item.name}
					sx={{
						':hover': {
							backgroundColor: '#2f2f2f',
							borderRadius: '0.5em',
						},
					}}
				>
					<IconButton>{item.icon}</IconButton>
				</Tooltip>
			))}
		</>
	);
}
