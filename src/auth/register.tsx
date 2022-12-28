import { Box, Button, Card, FormControl, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, registerUserWithEmailAndPassword } from '../config/firebase';
import { motion } from 'framer-motion';
// should be similar to login.tsx
export default function Register() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const [user, loading, error] = useAuthState(auth);
	const [passwordError, setPasswordError] = useState<Error>();
	const [passwordConfirmError, setPasswordConfirmError] = useState<Error>();
	const [userNameError, setUserNameError] = useState<Error>();
	const [emailError, setEmailError] = useState<Error>();
	const [submitError, setSubmitError] = useState<Error>();
	const [showForm, setShowForm] = useState<boolean>(false);
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (user) navigate('/');
	}, [user, loading]);

	const onRegister = async () => {
		let badInput = false;
		if (password !== passwordConfirm) {
			setPasswordConfirmError(new Error('Passwords do not match'));
			badInput = true;
		}
		if (password.length < 6) {
			setPasswordError(new Error('Password must be at least 6 characters'));
			badInput = true;
		}
		if (userName.length < 3) {
			setUserNameError(new Error('Username must be at least 3 characters'));
			badInput = true;
		}
		if (email.length < 3) {
			setEmailError(new Error('Email must be at least 3 characters'));
			badInput = true;
		}
		if (badInput) return;
		try {
			await registerUserWithEmailAndPassword(email, password, userName);
			navigate('/');
		} catch (error: any) {
			setSubmitError(error);
		}
	};

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (email.length < 3) {
			setEmailError(new Error('Email must be at least 3 characters'));
			return;
		}
		console.log('hi');
		setEmailError(undefined);
	};

	const onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
		if (userName.length < 3) {
			setUserNameError(new Error('Username must be at least 3 characters'));
			return;
		}
		setUserNameError(undefined);
	};

	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (password.length < 6) {
			setPasswordError(new Error('Password must be at least 6 characters'));
			return;
		}
		setPasswordError(undefined);
	};

	const onPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordConfirm(e.target.value);
		console.log(password === e.target.value);
		if (password !== e.target.value) {
			setPasswordConfirmError(new Error('Passwords do not match'));
		}
		setPasswordConfirmError(undefined);
	};

	// register page with email and password
	// using mui similar to login.tsx
	return (
		// flip transition with a background with nothing on it
		<motion.div initial={{ rotateX: 180 }} animate={{ rotateX: 0 }} transition={{ duration: 0.5 }} onAnimationComplete={() => setShowForm(true)}>
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
						<form
							onSubmit={(e) => {
								e.preventDefault();
								onRegister();
							}}
						>
							<FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
								<Typography variant='h4' sx={{ textAlign: 'center' }}>
									Register
								</Typography>
								<TextField
									type='text'
									label='Username'
									variant='outlined'
									onChange={onUserNameChange}
									error={!!userNameError}
									helperText={userNameError?.message}
									autoComplete='username'
								/>
								<TextField
									type='email'
									label='Email'
									variant='outlined'
									onChange={onEmailChange}
									error={!!emailError}
									helperText={emailError?.message}
								/>
								<TextField
									type={'password'}
									label='Password'
									variant='outlined'
									onChange={onPasswordChange}
									error={!!passwordError}
									helperText={passwordError?.message}
									autoComplete='new-password'
								/>
								<TextField
									type={'password'}
									label='Confirm Password'
									variant='outlined'
									onChange={onPasswordConfirmChange}
									error={!!passwordConfirmError}
									helperText={passwordConfirmError?.message}
									autoComplete='new-password'
								/>
								<Button variant='contained' type='submit'>
									Register
								</Button>
								{submitError && (
									<Typography variant='body1' color='error'>
										{submitError.message}
									</Typography>
								)}
								<Typography variant='body1'>
									Already have an account?{' '}
									<Link to='/login' style={{ textDecoration: 'none', color: 'cyan' }}>
										Login
									</Link>
								</Typography>
							</FormControl>
						</form>
					)}
				</Card>
			</Box>
		</motion.div>
	);
}
