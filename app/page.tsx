// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
	return (
		<div className='min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4'>
			<h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-6'>
				Welcome to Admin Dashboard
			</h1>
			<p className='text-gray-600 text-lg mb-8'>
				Please login or register to access your dashboard
			</p>
			<div className='flex gap-4'>
				<Link
					href='/login'
					className='px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition'
				>
					Login
				</Link>
				<Link
					href='/register'
					className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition'
				>
					Register
				</Link>
			</div>
		</div>
	)
}
