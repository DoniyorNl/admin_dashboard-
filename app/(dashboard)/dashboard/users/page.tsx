'use client'

import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Download,
	Filter,
	Mail,
	MapPin,
	MoreVertical,
	Phone,
	RefreshCw,
	Search,
	UserPlus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export interface User {
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
	const [totalPages] = useState(2)

	const fetchUsers = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=5&_page=${page}`)
			if (!res.ok) throw new Error('Failed to fetch users')
			const data: User[] = await res.json()

			// Smooth transition
			setTimeout(() => {
				setUsers(data)
				setLoading(false)
			}, 200)
		} catch (err) {
			setError('Failed to load users. Please try again.')
			console.error(err)
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
		<div className='space-y-4'>
			{/* Header Section */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
				<div>
					<h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Users</h1>
					<p className='text-sm text-slate-600 dark:text-slate-400'>
						Manage your user database and view user details
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button variant='outline' size='icon' onClick={fetchUsers} disabled={loading}>
						<RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
					</Button>
					<Button>
						<UserPlus className='w-4 h-4' />
						<span className='hidden sm:inline'>Add User</span>
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
				{/* Total Users */}
				<div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2'>
					<div className='flex items-center justify-between'>
						<div className='leading-tight'>
							<p className='text-xs text-slate-500 dark:text-slate-400'>Total Users</p>
							<p className='text-lg font-semibold text-slate-800 dark:text-slate-100'>10</p>
						</div>
						<div className='w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
							<UserPlus className='w-4 h-4 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				{/* Active Now */}
				<div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2'>
					<div className='flex items-center justify-between'>
						<div className='leading-tight'>
							<p className='text-xs text-slate-500 dark:text-slate-400'>Active Now</p>
							<p className='text-lg font-semibold text-slate-800 dark:text-slate-100'>
								{filteredUsers.length}
							</p>
						</div>
						<div className='w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
							<span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
						</div>
					</div>
				</div>

				{/* Current Page */}
				<div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2'>
					<div className='flex items-center justify-between'>
						<div className='leading-tight'>
							<p className='text-xs text-slate-500 dark:text-slate-400'>Page</p>
							<p className='text-lg font-semibold text-slate-800 dark:text-slate-100'>
								{page}/{totalPages}
							</p>
						</div>
						<div className='w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center'>
							<Filter className='w-4 h-4 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3'>
				<div className='flex flex-col sm:flex-row gap-3'>
					<div className='flex-1 relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder='Search users by name or email...'
							icon={<Search className='w-5 h-5 text-slate-400' />}
						/>
					</div>
					<div className='flex gap-2'>
						<Button variant='outline' icon={<Filter className='w-4 h-4' />}>
							Filter
						</Button>
						<Button variant='outline' icon={<Download className='w-4 h-4' />}>
							<span className='hidden sm:inline'>Export</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'>
				{error ? (
					<div className='flex flex-col items-center justify-center py-12 px-4'>
						<div className='w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3'>
							<AlertCircle className='w-7 h-7 text-red-600 dark:text-red-400' />
						</div>
						<p className='text-red-600 dark:text-red-400 font-medium mb-1'>Error Loading Users</p>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>{error}</p>
						<Button onClick={fetchUsers} variant='danger' icon={<RefreshCw className='w-4 h-4' />}>
							Try Again
						</Button>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
								<tr>
									<th className='px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										User
									</th>
									<th className='px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Email
									</th>
									<th className='px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Phone
									</th>
									<th className='px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Location
									</th>
									<th className='px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Company
									</th>
									<th className='px-3 py-2.5 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
								{loading
									? [...Array(5)].map((_, i) => (
											<tr key={`skeleton-${i}`} className='h-3 m-0 p-0'>
												<td className='px-2 py-1 whitespace-nowrap'>
													<div className='flex items-center gap-2'>
														<Skeleton circle width={32} height={30} />
														<div>
															<Skeleton width={100} height={12} />
															<Skeleton width={60} height={12} />
														</div>
													</div>
												</td>
												<td className='px-2 '>
													<Skeleton width={180} height={8} />
												</td>
												<td className='px-2 '>
													<Skeleton width={120} height={8} />
												</td>
												<td className='px-2 '>
													<Skeleton width={100} height={8} />
												</td>
												<td className='px-2 '>
													<Skeleton width={140} height={8} />
												</td>
												<td className='px-2 '>
													<div className='flex justify-center'>
														<Skeleton width={10} height={20} />
													</div>
												</td>
											</tr>
									  ))
									: filteredUsers.length === 0
									? [...Array(1)].map((_, i) => (
											<tr key={`empty-${i}`}>
												<td colSpan={6} className='px-3 py-2 text-center'>
													<div className='flex flex-col items-center justify-center'>
														<div className='w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3'>
															<Search className='w-7 h-7 text-slate-400' />
														</div>
														<p className='text-slate-600 dark:text-slate-400 font-medium mb-1'>
															No users found
														</p>
														<p className='text-sm text-slate-500 dark:text-slate-500'>
															Try adjusting your search
														</p>
													</div>
												</td>
											</tr>
									  ))
									: filteredUsers.map(user => (
											<tr
												key={user.id}
												className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
											>
												<td className='px-3 py-2 whitespace-nowrap'>
													<div className='flex items-center gap-2'>
														<div
															className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRandomColor(
																user.id,
															)} flex items-center justify-center text-white text-xs font-semibold shadow-lg flex-shrink-0`}
														>
															{getInitials(user.name)}
														</div>
														<div>
															<p className='m-0 font-medium text-sm text-slate-800 dark:text-slate-100'>
																{user.name}
															</p>
															<p className='m-0 text-xs text-slate-500 dark:text-slate-400'>
																ID: {user.id}
															</p>
														</div>
													</div>
												</td>
												<td className='px-3 py-2'>
													<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
														<Mail className='w-3.5 h-3.5 flex-shrink-0' />
														<span className='truncate max-w-xs'>{user.email}</span>
													</div>
												</td>
												<td className='px-3 py-2 whitespace-nowrap'>
													{user.phone ? (
														<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
															<Phone className='w-3.5 h-3.5 flex-shrink-0' />
															<span>{user.phone}</span>
														</div>
													) : (
														<span className='text-sm text-slate-400 dark:text-slate-500'>N/A</span>
													)}
												</td>
												<td className='px-3 py-2 whitespace-nowrap'>
													{user.address ? (
														<div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
															<MapPin className='w-3.5 h-3.5 flex-shrink-0' />
															<span>{user.address.city}</span>
														</div>
													) : (
														<span className='text-sm text-slate-400 dark:text-slate-500'>N/A</span>
													)}
												</td>
												<td className='px-3 py-2'>
													<span className='text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block'>
														{user.company?.name || 'N/A'}
													</span>
												</td>
												<td className='px-3 py-2 whitespace-nowrap text-center'>
													<Button variant='ghost' size='icon'>
														<MoreVertical className='w-4 h-4' />
													</Button>
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
				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-slate-600 dark:text-slate-400'>
							Showing{' '}
							<span className='font-medium text-slate-800 dark:text-slate-100'>
								{filteredUsers.length}
							</span>{' '}
							of <span className='font-medium text-slate-800 dark:text-slate-100'>10</span> users
						</p>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								onClick={() => setPage(prev => Math.max(1, prev - 1))}
								disabled={page === 1}
								icon={<ChevronLeft className='w-4 h-4' />}
							>
								<span className='hidden sm:inline'>Previous</span>
							</Button>

							<div className='flex items-center gap-1'>
								{[...Array(totalPages)].map((_, i) => (
									<Button
										key={i + 1}
										variant={page === i + 1 ? 'gradient' : 'outline'}
										size='icon'
										onClick={() => setPage(i + 1)}
									>
										{i + 1}
									</Button>
								))}
							</div>

							<Button
								variant='outline'
								onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
								disabled={page === totalPages}
								icon={<ChevronRight className='w-4 h-4' />}
								iconPosition='right'
							>
								<span className='hidden sm:inline'>Next</span>
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
