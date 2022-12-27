import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, registerUserWithEmailAndPassword } from '../config/firebase';

// should be similar to login.tsx
export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (user) navigate('/');
	}, [user, loading]);

	const onRegister = async () => {
		// check if password and passwordConfirm are the same
		// if not, return error
		// if so, create user with email and password
		// if error, return error
		// if success, navigate to root
		if (password !== passwordConfirm) {
			return;
		}
		try {
			await registerUserWithEmailAndPassword(email, password);
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	// register page with email and password
	// using tailwindcss similar design as discord
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-slate-900'>
			<div className='flex flex-col items-center justify-center w-96 h-96 bg-slate-800 rounded-2xl'>
				<div className='flex flex-col items-center justify-center w-full h-1/3'>
					<h1 className='text-3xl font-bold text-white'>Register</h1>
				</div>
				<div className='flex flex-col items-center justify-center w-full h-1/3 gap-4'>
					<input
						className='w-3/4 h-10 px-2 text-slate-900 bg-slate-300 rounded-md'
						type='email'
						placeholder='Email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className='w-3/4 h-10 px-2 text-slate-900 bg-slate-300 rounded-md'
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						className='w-3/4 h-10 px-2 text-slate-900 bg-slate-300 rounded-md'
						type='password'
						placeholder='Confirm Password'
						value={passwordConfirm}
						onChange={(e) => setPasswordConfirm(e.target.value)}
					/>
				</div>
				<div className='flex flex-col items-center justify-center w-full h-1/3 gap-4'>
					<button className='w-3/4 h-10 px-2 text-slate-900 bg-blue-500 rounded-md hover:bg-blue-600' onClick={onRegister}>
						Register
					</button>
				</div>
			</div>
		</div>
	);
}
