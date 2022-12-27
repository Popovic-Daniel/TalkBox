import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, loginWithEmailAndPassword, signInWithGoogle } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Login() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (user) navigate('/');
	}, [user, loading]);
	// login page with email and password and google login
	// using tailwindcss similar design as discord
	// the google login button should be white with a google logo
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-slate-900'>
			<div className='flex flex-col items-center justify-center w-96 h-96 bg-slate-800 rounded-2xl'>
				{/* Login text*/}
				<div className='flex flex-col items-center justify-center w-full h-1/3'>
					<h1 className='text-3xl font-bold text-white'>Login</h1>
				</div>
				{/* Email and password input fields */}
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
				</div>
				{/* Login button */}
				<div className='flex flex-col items-center justify-center w-full h-1/3'>
					<button
						className='w-3/4 h-10 px-2 text-slate-900 bg-blue-500 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600'
						onClick={() => loginWithEmailAndPassword(email, password)}
					>
						Login
					</button>
				</div>
				{/* Google login button */}
				<div className='flex flex-col items-center justify-center w-full h-1/3'>
					<button
						className='w-3/4 h-10 px-2 text-slate-900 bg-white rounded-md flex items-center justify-center gap-2 hover:bg-slate-200
                    '
						onClick={() => signInWithGoogle()}
					>
						<img
							className='w-5 h-5'
							src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
							alt='google logo'
						/>
						Login with Google
					</button>
				</div>
				{/* Register text */}
				<div className='flex flex-col items-center justify-center w-full h-1/3'>
					<p className='text-slate-200'>
						Don't have an account?{' '}
						<Link
							to='/register'
							className='text-cyan-500 hover:text-cyan-600 hover:underline
                        '
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
