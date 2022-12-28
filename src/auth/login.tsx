import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, loginWithEmailAndPassword, signInWithGoogle } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Button, Card, FormControl, FormGroup, Icon, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Google } from '@mui/icons-material';

export default function Login() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [user, loading, error] = useAuthState(auth);
	const [showForm, setShowForm] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (loading) return;
		if (user) navigate('/');
	}, [user, loading]);
	// login page with email and password and google login
	// using mui similar
	// the google login button should be white with a google logo
	return (
		// flip card animation
		<motion.div
			initial={{ rotateX: 180 }}
			animate={{ rotateX: 0 }}
			transition={{ duration: 0.5 }}
			// after the animation is done the card should be flipped
			// and the user should be able to see the login form
			onAnimationComplete={() => {
				setShowForm(true);
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
					width: '100vw',
				}}
			>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '60vh',
						width: '50vw',
						borderRadius: '1em',
					}}
				>
					{showForm && (
						<FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Typography variant='h4' textAlign={'center'}>
								Login
							</Typography>
							<TextField type='email' label='Email' variant='outlined' onChange={(e) => setEmail(e.target.value)} />
							<TextField type={'password'} label='Password' variant='outlined' onChange={(e) => setPassword(e.target.value)} />
							<Button variant='contained' onClick={() => loginWithEmailAndPassword(email, password)}>
								Login
							</Button>
							<Button
								variant='text'
								onClick={() => signInWithGoogle()}
								sx={{
									color: 'black',
									backgroundColor: 'white',
									'&:hover': {
										backgroundColor: 'black',
										color: 'white',
									},
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									verticalAlign: 'middle',
								}}
							>
								<Google />
								<Typography>Login with Google</Typography>
							</Button>
							<Typography variant='body1'>
								Don't have an account?{' '}
								<Link to='/register' style={{ textDecoration: 'none', color: 'cyan' }}>
									Register
								</Link>
							</Typography>
						</FormControl>
					)}
				</Card>
			</Box>
		</motion.div>
	);
}
