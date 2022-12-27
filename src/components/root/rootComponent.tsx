import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, logout } from '../../config/firebase';

export default function RootComponent() {
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		console.log('user', user);
		if (loading) return;
		if (!user) navigate('/login');
	}, [user, loading]);

	const [dropdownUser, setDropdownUser] = useState<boolean>(false);

	// nav which ist 1/5 of the screen horizontally
	// the rest is the content
	// on the bottom of the nav should be an avatar with the username
	// when clicking on the avatar, a dropdown should appear with logout
	// when clicking on logout, the user should be logged out and navigated to login
	return (
		<div className='flex flex-row items-start justify-start h-screen bg-slate-900'>
			<div className='flex flex-col items-center justify-start w-1/6 h-full bg-slate-800'>
				<div className='flex flex-col items-center justify-center w-full h-16'>
					{/* search bar lookalike opens a dialogue */}
					<div
						className='flex flex-row items-center justify-center w-3/4 h-10 px-2 text-slate-900 bg-slate-300 rounded-md cursor-pointer
					hover:bg-slate-400 hover:opacity-75 transition-all duration-300 ease-in-out
					'
					>
						<svg
							className='w-6 h-6 text-slate-900'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
						</svg>
						{/* not an input field */}
						<div
							className='flex flex-row items-center justify-center w-full h-full px-2 text-sm text-slate-900 bg-transparent rounded-md opacity-50
						'
						>
							Search
						</div>
					</div>
				</div>
				<div className='bg-slate-700 w-full h-px'></div>
				<div className='flex flex-col items-center justify-start w-full h-full p-4'>
					<div
						className='flex flex-row items-center justify-start w-full h-16 px-4 text-slate-100 bg-slate-800
					hover:bg-slate-700  transition-all duration-300 ease-in-out rounded-md gap-2
					'
					>
						{/* person icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							fill='currentColor'
							className='bi bi-person-fill'
							viewBox='0 0 16 16'
						>
							<path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
						</svg>
						<div className='flex flex-row items-center justify-start w-full h-full  text-lg text-slate-100 bg-transparent rounded-md'>
							Friends
						</div>
					</div>
					{/* bottom of the nav: avatar*/}
					<div className='flex-row h-full w-full'></div>
					<div
						className='flex flex-row items-center justify-center w-full h-16 px-4 text-slate-100 bg-slate-800
					'
					>
						<div
							className='relative flex flex-row items-center justify-start w-full h-full px-4 text-lg text-slate-100  rounded-md hover:bg-slate-700 transition-all duration-300 ease-in-out cursor-pointer'
							data-toggle='dropdown'
						>
							{/* person icon */}
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								fill='currentColor'
								className='bi bi-person-fill'
								viewBox='0 0 16 16'
							>
								<path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
							</svg>
							<div
								className='flex flex-row items-center justify-start w-full h-full px-4 text-lg text-slate-100 bg-transparent rounded-md'
								onClick={() => setDropdownUser(!dropdownUser)}
							>
								{user?.displayName}
							</div>
							{/* dropdown with logout item */}
						</div>
						{/* dropdown */}
					</div>
				</div>
			</div>

			<div className='flex flex-col items-center justify-start w-4/5 h-full'>
				<Outlet />
			</div>
		</div>
	);
}
