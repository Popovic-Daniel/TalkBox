import { Box, Typography } from '@mui/material';
export default function SearchComponent() {
	return (
		<Box sx={{ display: 'flex', height: '8vh' }}>
			{/* search bar which opens a dialog => is just a dummy*/}
			<Box
				sx={{
					cursor: 'pointer',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					bgcolor: '#121212',
					width: '100%',
					marginBottom: '1em',
					borderRadius: '0.5em',
					opacity: 0.6,
				}}
			>
				<Typography>Search</Typography>
			</Box>
		</Box>
	);
}
