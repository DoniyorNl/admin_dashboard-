'use client'

import Badge from '@/components/UI/Badge'
import BaseModal from '@/components/UI/BaseModal'
import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { Pagination } from '@/components/UI/Pagination'
import { AlertCircle, Download, Filter, MoreVertical, RefreshCw, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export interface Order {
	id: number
	customerName: string
	email: string
	phone?: string
	status: 'Pending' | 'Processing' | 'Completed' | 'Canceled'
	total: number
	date: string
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [showModal, setShowModal] = useState(false)
	const [totalPages, setTotalPages] = useState(2) // Example
	const [showFilter, setShowFilter] = useState(false)
	const filterRef = useRef<HTMLDivElement | null>(null)

	const [sortBy, setSortBy] = useState<
		'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'total-asc' | 'total-desc' | null
	>(null)

	// Mock fetchOrders function
	const fetchOrders = async () => {
		setLoading(true)
		setError(null)
		try {
			// Simulate API call
			const res = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=5&_page=${page}`)
			if (!res.ok) throw new Error('Failed to fetch orders')
			const data = await res.json()

			// Map data to Order type
			const ordersData: Order[] = data.map(
				(u: { id: number; name: string; email: string; phone?: string }, i: number) => ({
					id: u.id,
					customerName: u.name,
					email: u.email,
					phone: u.phone,
					status: ['Pending', 'Processing', 'Completed', 'Canceled'][i % 4] as Order['status'],
					total: Math.floor(Math.random() * 500) + 50,
					date: new Date().toISOString().split('T')[0],
				}),
			)

			setTimeout(() => {
				setOrders(ordersData)
				setLoading(false)
			}, 200) // Smooth transition
		} catch {
			setError('Failed to load orders. Please try again.')
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchOrders()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page])

	const getStatusColor = (status: Order['status']) => {
		switch (status) {
			case 'Pending':
				return 'yellow'
			case 'Processing':
				return 'blue'
			case 'Completed':
				return 'green'
			case 'Canceled':
				return 'red'
		}
	}

	//  for filter
	const filteredOrders = useMemo(() => {
		let result = [...orders]

		// 🔍 Search
		if (searchQuery) {
			result = result.filter(
				o =>
					o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					o.email.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		}

		// 🟢 Status filter
		if (statusFilter !== 'all') {
			result = result.filter(o => o.status === statusFilter)
		}

		// ↕️ Sorting
		if (sortBy) {
			result.sort((a, b) => {
				switch (sortBy) {
					case 'name-asc':
						return a.customerName.localeCompare(b.customerName)
					case 'name-desc':
						return b.customerName.localeCompare(a.customerName)
					case 'date-asc':
						return new Date(a.date).getTime() - new Date(b.date).getTime()
					case 'date-desc':
						return new Date(b.date).getTime() - new Date(a.date).getTime()
					case 'total-asc':
						return a.total - b.total
					case 'total-desc':
						return b.total - a.total
					default:
						return 0
				}
			})
		}

		return result
	}, [orders, searchQuery, statusFilter, sortBy])
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setShowFilter(false)
			}
		}

		if (showFilter) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showFilter])

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
				<div>
					<h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Orders</h1>
					<p className='text-sm text-slate-600 dark:text-slate-400'>
						Manage your orders, track statuses, and export data
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button variant='outline' size='icon' onClick={fetchOrders} disabled={loading}>
						<RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
					</Button>
					<Button onClick={() => setShowModal(true)}>
						<span className='hidden sm:inline'>Add Order</span>
					</Button>
				</div>
			</div>

			{/* Search & Filter */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col sm:flex-row gap-3 items-center'>
				<Input
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					placeholder='Search orders by name or email...'
					icon={<Search className='w-4 h-4 text-slate-800' />}
				/>
				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className='px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
				>
					<option value='all'>All Statuses</option>
					<option value='Pending'>Pending</option>
					<option value='Processing'>Processing</option>
					<option value='Completed'>Completed</option>
					<option value='Canceled'>Canceled</option>
				</select>
				{/* Filter dropdown */}
				<div className='relative' ref={filterRef}>
					<Button
						variant='outline'
						icon={<Filter className='w-4 h-4' />}
						onClick={() => setShowFilter(prev => !prev)}
					>
						Filter
					</Button>

					{showFilter && (
						<div
							className='absolute right-0 mt-2 w-56 rounded-xl border
			border-slate-200 dark:border-slate-700
			bg-white dark:bg-slate-900
			shadow-lg p-2 z-50'
						>
							<p className='text-xs font-semibold text-slate-500 px-2 py-1'>SORT BY</p>

							<button onClick={() => setSortBy('name-asc')} className='filter-item'>
								Name (A → Z)
							</button>
							<button onClick={() => setSortBy('name-desc')} className='filter-item'>
								Name (Z → A)
							</button>

							<button onClick={() => setSortBy('date-desc')} className='filter-item'>
								Newest First
							</button>
							<button onClick={() => setSortBy('date-asc')} className='filter-item'>
								Oldest First
							</button>

							<button onClick={() => setSortBy('total-desc')} className='filter-item'>
								Highest Total
							</button>
							<button onClick={() => setSortBy('total-asc')} className='filter-item'>
								Lowest Total
							</button>

							<div className='border-t border-slate-200 dark:border-slate-700 my-2' />

							<button
								onClick={() => {
									setSortBy(null)
									setShowFilter(false)
								}}
								className='w-full text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-3 py-2'
							>
								Clear Sorting
							</button>
						</div>
					)}
				</div>

				<Button variant='outline' icon={<Download className='w-4 h-4' />}>
					Export
				</Button>
			</div>

			{/* Orders Table */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto'>
				{error ? (
					<div className='flex flex-col items-center justify-center py-12 px-4'>
						<div className='w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3'>
							<AlertCircle className='w-7 h-7 text-red-600 dark:text-red-400' />
						</div>
						<p className='text-red-600 dark:text-red-400 font-medium mb-1'>Error Loading Orders</p>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>{error}</p>
						<Button onClick={fetchOrders} variant='danger' icon={<RefreshCw className='w-4 h-4' />}>
							Try Again
						</Button>
					</div>
				) : (
					<table className='w-full'>
						<thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
							<tr>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Order ID
								</th>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Customer
								</th>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Email
								</th>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Status
								</th>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Total
								</th>
								<th className='px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Date
								</th>
								<th className='px-3 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
							{loading ? (
								[...Array(5)].map((_, i) => (
									<tr key={i} className='h-3 m-0 p-0'>
										<td colSpan={7} className='px-2 py-1'>
											<Skeleton baseColor='#e5e7eb' highlightColor='#f3f4f6' />
										</td>
									</tr>
								))
							) : filteredOrders.length === 0 ? (
								<tr>
									<td colSpan={7} className='px-3 py-2 text-center'>
										<p className='text-slate-600 dark:text-slate-400'>No orders found</p>
									</td>
								</tr>
							) : (
								filteredOrders.map(order => (
									<tr
										key={order.id}
										className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200'
									>
										<td className='px-3 py-2 text-slate-800 dark:text-slate-100'>{order.id}</td>
										<td className='px-3 py-2 text-slate-800 dark:text-slate-100'>
											{order.customerName}
										</td>
										<td className='px-3 py-2 text-slate-800 dark:text-slate-100'>{order.email}</td>
										<td className='px-3 py-2'>
											<Badge color={getStatusColor(order.status)}>{order.status}</Badge>
										</td>
										<td className='px-3 py-2 text-slate-800 dark:text-slate-100'>${order.total}</td>
										<td className='px-3 py-2 text-slate-800 dark:text-slate-100'>{order.date}</td>
										<td className='px-3 py-2 text-right'>
											<Button variant='ghost' size='icon'>
												<MoreVertical className='w-4 h-4 text-slate-600 dark:text-slate-300' />
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>

			{/* Pagination */}
			{!loading && !error && filteredOrders.length > 0 && (
				<Pagination page={page} totalPages={totalPages} setPage={setPage} />
			)}

			{/* Add/Edit Order Modal */}
			{showModal && (
				<BaseModal title='Add New Order' onClose={() => setShowModal(false)}>
					<div className='flex flex-col gap-6 p-3'>
						{/* Form */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{/* Customer Name */}
							<Input label='Customer Name' placeholder='name' />

							{/* Email */}
							<Input label='Email' type='email' placeholder='admin@example.com' />

							{/* Phone */}
							<Input label='Phone' type='tel' placeholder='+1 234 567 890' />

							{/* Total Amount */}
							<Input label='Total Amount' type='number' placeholder='0.00' />

							{/* Status */}
							<div className='flex flex-col gap-1 sm:col-span-2'>
								<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
									Status
								</label>
								<select
									className='w-full px-4 py-2 rounded-lg border
						border-slate-200 dark:border-slate-700
						bg-white dark:bg-slate-800
						text-slate-800 dark:text-slate-100
						focus:outline-none focus:ring-2
						focus:ring-blue-500 dark:focus:ring-blue-400
						transition-all'
								>
									<option value='Pending'>Pending</option>
									<option value='Processing'>Processing</option>
									<option value='Completed'>Completed</option>
									<option value='Canceled'>Canceled</option>
								</select>
							</div>
						</div>

						{/* Divider */}
						<div className='border-t border-slate-200 dark:border-slate-800 pt-4' />

						{/* Actions */}
						<div className='flex flex-col sm:flex-row justify-end gap-3'>
							<Button
								variant='outline'
								className='sm:w-auto w-full'
								onClick={() => setShowModal(false)}
							>
								Cancel
							</Button>
							<Button className='sm:w-auto w-full'>Add Order</Button>
						</div>
					</div>
				</BaseModal>
			)}
		</div>
	)
}
