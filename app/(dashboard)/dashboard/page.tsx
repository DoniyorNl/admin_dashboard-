'use client'

export default function Dashboard() {
	return (
		<div className='flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
			<div className='flex-1 flex flex-col'>
				<main className='p-6 flex-1 overflow-auto'>
					<h1 className='text-3xl font-bold mb-4 text-primary dark:text-accent'>
						Welcome to Dashboard
					</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col'>
							<span className='text-gray-500 dark:text-gray-300'>Users</span>
							<span className='text-2xl font-bold text-primary dark:text-accent'>1,245</span>
						</div>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col'>
							<span className='text-gray-500 dark:text-gray-300'>Revenue</span>
							<span className='text-2xl font-bold text-green-700 dark:text-accent'>$12,345</span>
						</div>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col'>
							<span className='text-gray-500 dark:text-gray-300'>Orders</span>
							<span className='text-2xl font-bold text-primary dark:text-accent'>567</span>
						</div>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col'>
							<span className='text-gray-500 dark:text-gray-300'>Feedback</span>
							<span className='text-2xl font-bold text-primary dark:text-accent'>124</span>
						</div>
					</div>

					<div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-64 flex items-center justify-center'>
							<span className='text-gray-400 dark:text-gray-500'>Chart Placeholder</span>
						</div>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-64 flex items-center justify-center'>
							<span className='text-gray-400 dark:text-gray-500'>Chart Placeholder</span>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
