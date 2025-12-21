'use client'

import { useEffect, useRef, useState } from 'react'
import {
	Search,
	Filter,
	Download,
	UserPlus,
	MoreVertical,
	Mail,
	Phone,
	MapPin,
	Loader2,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
	AlertCircle,
} from 'lucide-react'

interface User {
	id: number
	name: string
	email: string
	phone?: string
	address?: {
		city: string
		street: string
	}
	company?: {
		name: string
	}
}

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [totalPages] = useState(3) // JSONPlaceholder has ~10 users, 3 per page = ~3 pages
	const fetchUsers = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=3&_page=${page}`)
			if (!res.ok) throw new Error('Failed to fetch users')
			const data: User[] = await res.json()
			setUsers(data)
		} catch (err) {
			setError('Failed to load users. Please try again.')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [page])

	const filteredUsers = users.filter(
		user =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const getRandomColor = (id: number) => {
		const colors = [
			'from-blue-500 to-indigo-600',
			'from-purple-500 to-pink-600',
			'from-green-500 to-emerald-600',
			'from-orange-500 to-red-600',
			'from-cyan-500 to-blue-600',
		]
		return colors[id % colors.length]
	}

	return (
		<div className='space-y-6'>
			{/* Header Section */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Users</h1>
					<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
						Manage your user database and view user details
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<button
						onClick={fetchUsers}
						disabled={loading}
						className='p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50'
					>
						<RefreshCw
							className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${
								loading ? 'animate-spin' : ''
							}`}
						/>
					</button>
					<button className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 font-medium'>
						<UserPlus className='w-4 h-4' />
						<span className='hidden sm:inline'>Add User</span>
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Total Users</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>10</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
							<UserPlus className='w-6 h-6 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Active Now</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								{filteredUsers.length}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
							<div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Current Page</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								{page}/{totalPages}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center'>
							<Filter className='w-6 h-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className=' bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='flex-1 relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<input
							type='text'
							placeholder='Search users by name or email...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all'
						/>
					</div>
					<div className='flex gap-2'>
						<button className='flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200'>
							<Filter className='w-4 h-4' />
							<span>Filter</span>
						</button>
						<button className='flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200'>
							<Download className='w-4 h-4' />
							<span className='hidden sm:inline'>Export</span>
						</button>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'>
				{error ? (
					<div className='flex flex-col items-center justify-center py-16 px-4'>
						<div className='w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4'>
							<AlertCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
						</div>
						<p className='text-red-600 dark:text-red-400 font-medium mb-2'>Error Loading Users</p>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>{error}</p>
						<button
							onClick={fetchUsers}
							className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
						>
							<RefreshCw className='w-4 h-4' />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className='flex flex-col items-center justify-center py-16'>
						<Loader2 className='w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4' />
						<p className='text-slate-600 dark:text-slate-400'>Loading users...</p>
					</div>
				) : filteredUsers.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16 px-4'>
						<div className='w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4'>
							<Search className='w-8 h-8 text-slate-400' />
						</div>
						<p className='text-slate-600 dark:text-slate-400 font-medium mb-2'>No users found</p>
						<p className='text-sm text-slate-500 dark:text-slate-500'>Try adjusting your search</p>
					</div>
				) : (
					<div className='overflow-x-auto min-h-[300px]'>
						<table className='w-full '>
							<thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
								<tr>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										User
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Email
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Phone
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Location
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Company
									</th>
									<th className='px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
								{filteredUsers.map(user => (
									<tr
										key={user.id}
										className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
									>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center gap-3'>
												<div
													className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRandomColor(
														user.id,
													)} flex items-center justify-center text-white text-sm font-semibold shadow-lg flex-shrink-0`}
												>
													{getInitials(user.name)}
												</div>
												<div>
													<p className='font-medium text-slate-800 dark:text-slate-100'>
														{user.name}
													</p>
													<p className='text-sm text-slate-500 dark:text-slate-400'>
														ID: {user.id}
													</p>
												</div>
											</div>
										</td>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
												<Mail className='w-4 h-4 flex-shrink-0' />
												<span className='truncate max-w-xs'>{user.email}</span>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{user.phone ? (
												<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
													<Phone className='w-4 h-4 flex-shrink-0' />
													<span>{user.phone}</span>
												</div>
											) : (
												<span className='text-sm text-slate-400 dark:text-slate-500'>N/A</span>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{user.address ? (
												<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
													<MapPin className='w-4 h-4 flex-shrink-0' />
													<span>{user.address.city}</span>
												</div>
											) : (
												<span className='text-sm text-slate-400 dark:text-slate-500'>N/A</span>
											)}
										</td>
										<td className='px-6 py-4'>
											<span className='text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block'>
												{user.company?.name || 'N/A'}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-right'>
											<button className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
												<MoreVertical className='w-5 h-5 text-slate-600 dark:text-slate-400' />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Pagination */}
			{!loading && !error && filteredUsers.length > 0 && (
				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-slate-600 dark:text-slate-400'>
							Showing{' '}
							<span className='font-medium text-slate-800 dark:text-slate-100'>
								{filteredUsers.length}
							</span>{' '}
							of <span className='font-medium text-slate-800 dark:text-slate-100'>10</span> users
						</p>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => setPage(prev => Math.max(1, prev - 1))}
								disabled={page === 1}
								className='flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200'
							>
								<ChevronLeft className='w-4 h-4' />
								<span className='hidden sm:inline'>Previous</span>
							</button>

							<div className='flex items-center gap-1'>
								{[...Array(totalPages)].map((_, i) => (
									<button
										type='button'
										key={i + 1}
										onClick={e => {
											e.preventDefault()
											setPage(i + 1)
										}}
										className={`w-10 h-10 rounded-lg font-medium transition-all ${
											page === i + 1
												? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
												: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
										}`}
									>
										{i + 1}
									</button>
								))}
							</div>

							<button
								type='button'
								onClick={e => {
									e.preventDefault()
									setPage(prev => Math.min(totalPages, prev + 1))
								}}
								disabled={page === totalPages}
								className='flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200'
							>
								<span className='hidden sm:inline'>Next</span>
								<ChevronRight className='w-4 h-4' />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
