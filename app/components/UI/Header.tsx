'use client'

import { clearClientAuth, getClientUser, logoutUser, setClientUser } from 'lib/auth/auth.client'
import {
	Bell,
	ChevronDown,
	Inbox,
	LogOut,
	Menu,
	Moon,
	Search,
	Settings,
	Sun,
	User,
	X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { User as AuthUser } from 'lib/auth/types'

type NotificationItem = {
	id: string
	title: string
	body: string
	createdAt: string
	href?: string
	unread: boolean
}

const NOTIFICATIONS_STORAGE_KEY = 'admin-dashboard.notifications.v1'

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 'welcome-demo',
		title: 'Welcome — demo is public',
		body: 'Tip: share /demo for recruiter reviews (no login required).',
		href: '/demo',
		createdAt: '2026-03-07T00:00:00.000Z',
		unread: true,
	},
]

function parseNotifications(value: string): NotificationItem[] | null {
	try {
		const parsed = JSON.parse(value) as unknown
		if (!Array.isArray(parsed)) return null
		const items: NotificationItem[] = []
		for (const n of parsed) {
			if (typeof n !== 'object' || n === null) return null
			const obj = n as Partial<NotificationItem>
			if (typeof obj.id !== 'string') return null
			if (typeof obj.title !== 'string') return null
			if (typeof obj.body !== 'string') return null
			if (typeof obj.createdAt !== 'string') return null
			if (typeof obj.unread !== 'boolean') return null
			if (obj.href !== undefined && typeof obj.href !== 'string') return null
			items.push({
				id: obj.id,
				title: obj.title,
				body: obj.body,
				createdAt: obj.createdAt,
				href: obj.href,
				unread: obj.unread,
			})
		}
		return items
	} catch {
		return null
	}
}

export default function Header() {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
	const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const searchRef = useRef<HTMLDivElement | null>(null)
	const notificationsRef = useRef<HTMLDivElement | null>(null)
	const hydratedRef = useRef(false)
	const { theme, setTheme, systemTheme } = useTheme()

	useEffect(() => {
		let active = true
		const controller = new AbortController()

		const syncUser = async () => {
			try {
				const res = await fetch('/authAPI/me', {
					method: 'GET',
					credentials: 'include',
					cache: 'no-store',
					signal: controller.signal,
				})

				if (!active) return

				if (res.ok) {
					const body = (await res.json()) as { user?: AuthUser }
					if (body.user) {
						setClientUser(body.user)
						setUser(body.user)
						return
					}
				}

				clearClientAuth()
				setUser(null)
			} catch {
				if (!active || controller.signal.aborted) return
				setUser(getClientUser())
			}
		}

		syncUser()

		const onStorage = (e: StorageEvent) => {
			if (e.key === 'user') {
				setUser(getClientUser())
			}
		}
		window.addEventListener('storage', onStorage)

		return () => {
			active = false
			controller.abort()
			window.removeEventListener('storage', onStorage)
		}
	}, [])

	// Seed + hydrate notifications once (localStorage-backed imitation).
	useEffect(() => {
		hydratedRef.current = true

		const init = async () => {
			try {
				const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
				if (raw) {
					const parsed = parseNotifications(raw)
					if (parsed) {
						setNotifications(parsed)
						return
					}
					window.localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
				}

				window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS))
				setNotifications(DEFAULT_NOTIFICATIONS)
			} catch {
				// If localStorage is unavailable, keep in-memory defaults.
			}
		}

		init()
	}, [])

	// Persist notifications after hydration.
	useEffect(() => {
		if (!hydratedRef.current) return
		try {
			window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
		} catch {
			// ignore
		}
	}, [notifications])

	// Dropdown yoki search tashqarisiga bosilganda yopish
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsDropdownOpen(false)
			if (searchRef.current && !searchRef.current.contains(target)) setIsSearchOpen(false)
			if (notificationsRef.current && !notificationsRef.current.contains(target))
				setIsNotificationsOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const getInitials = (name: string | null | undefined) => {
		if (!name) return 'G'
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	// Dark mode aniqlash
	const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
	const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark')

	const unreadCount = useMemo(
		() => notifications.reduce((acc, n) => acc + (n.unread ? 1 : 0), 0),
		[notifications],
	)
	const hasNotifications = unreadCount > 0

	const markAllRead = () => {
		setNotifications(prev => prev.map(n => (n.unread ? { ...n, unread: false } : n)))
	}

	const dismissNotification = (id: string) => {
		setNotifications(prev => prev.filter(n => n.id !== id))
	}

	const clearAllNotifications = () => setNotifications([])

	return (
		<header className='flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95'>
			{/* Left Section */}
			<div className='flex items-center gap-4'>
				<button className='lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
					<Menu className='w-5 h-5 text-slate-600 dark:text-slate-300' />
				</button>

				<div className='flex items-center gap-3'>
					<div className='w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30'>
						AD
					</div>
					<span className='hidden sm:block text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
						Admin Dashboard
					</span>
				</div>
			</div>

			{/* Right Section */}
			<div className='flex items-center gap-2'>
				{/* Search */}
				<div ref={searchRef} className='relative'>
					{isSearchOpen ? (
						<div className='flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 transition-all duration-200'>
							<Search className='w-4 h-4 text-slate-400' />
							<input
								type='text'
								placeholder='Search...'
								autoFocus
								className='bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-32 sm:w-48'
							/>
						</div>
					) : (
						<button
							onClick={() => setIsSearchOpen(true)}
							className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
						>
							<Search className='w-5 h-5 text-slate-600 dark:text-slate-300' />
						</button>
					)}
				</div>

				{/* Dark Mode Toggle */}
				<button
					onClick={toggleDarkMode}
					className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300'
				>
					{isDarkMode ? (
						<Sun className='w-5 h-5 text-yellow-500' />
					) : (
						<Moon className='w-5 h-5 text-slate-600 dark:text-slate-300' />
					)}
				</button>

				{/* Notifications */}
				<div ref={notificationsRef} className='relative'>
					<button
						onClick={() => {
							setIsNotificationsOpen(open => {
								const next = !open
								if (next) markAllRead()
								return next
							})
							setIsDropdownOpen(false)
							setIsSearchOpen(false)
						}}
						aria-haspopup='menu'
						aria-expanded={isNotificationsOpen}
						className='relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
					>
						<Bell className='w-5 h-5 text-slate-600 dark:text-slate-300' />
						{hasNotifications && (
							<>
								<span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse' />
								<span className='absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow'>
									{Math.min(unreadCount, 9)}
								</span>
							</>
						)}
					</button>

					{isNotificationsOpen && (
						<div className='absolute right-0 mt-2 w-[360px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
							<div className='px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3'>
								<div className='min-w-0'>
									<p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
										Notifications
									</p>
									<p className='text-xs text-slate-500 dark:text-slate-400'>
										Demo-ready UI (replace with real data later)
									</p>
								</div>
								<button
									onClick={() => setIsNotificationsOpen(false)}
									className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
									aria-label='Close notifications'
								>
									<X className='w-4 h-4 text-slate-600 dark:text-slate-300' />
								</button>
							</div>

							{notifications.length === 0 ? (
								<div className='p-8 text-center'>
									<div className='w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3'>
										<Inbox className='w-6 h-6 text-slate-500 dark:text-slate-300' />
									</div>
									<p className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
										You&apos;re all caught up
									</p>
									<p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
										New updates will show up here.
									</p>
								</div>
							) : (
								<ul className='max-h-[360px] overflow-auto'>
									{notifications.map(n => (
										<li key={n.id} className='border-b border-slate-100 dark:border-slate-800 last:border-b-0'>
											<div
												className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
													n.unread ? 'bg-indigo-50/40 dark:bg-indigo-500/10' : ''
												}`}
											>
												<div className='flex items-start gap-3'>
													<div className='mt-1'>
														<span
															className={`block w-2.5 h-2.5 rounded-full ${
																n.unread ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
															}`}
														/>
													</div>

													<div className='flex-1 min-w-0'>
														<div className='flex items-start justify-between gap-2'>
															<p className='text-sm font-semibold text-slate-900 dark:text-slate-100 truncate'>
																{n.title}
															</p>
															<button
																onClick={e => {
																	e.stopPropagation()
																	dismissNotification(n.id)
																}}
																className='p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
																aria-label='Dismiss notification'
															>
																<X className='w-4 h-4 text-slate-500 dark:text-slate-300' />
															</button>
														</div>
														<p className='mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2'>
															{n.body}
														</p>
														<div className='mt-2 flex items-center justify-between'>
															<span className='text-[11px] text-slate-500 dark:text-slate-400'>
																{n.unread ? 'New' : 'Seen'}
															</span>
															{n.href && (
																<Link
																	href={n.href}
																	onClick={() => setIsNotificationsOpen(false)}
																	className='text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline'
																>
																	Open
																</Link>
															)}
														</div>
													</div>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}

							<div className='px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between'>
								<button
									onClick={markAllRead}
									className='text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors'
								>
									Mark all as read
								</button>
								<button
									onClick={clearAllNotifications}
									className='text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors'
								>
									Clear all
								</button>
							</div>
						</div>
					)}
				</div>

				<div className='hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2' />

				{/* User Dropdown */}
				<div ref={dropdownRef} className='relative'>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className='flex items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group'
					>
						<span className='hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200'>
							{user?.name || 'Guest'}
						</span>

						<div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-105'>
							{getInitials(user?.name)}
						</div>

						<ChevronDown
							className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200 ${
								isDropdownOpen ? 'rotate-180' : ''
							}`}
						/>
					</button>

					{isDropdownOpen && (
						<div className='absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
							{/* User Info */}
							<div className='px-4 py-3 border-b border-slate-200 dark:border-slate-800'>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold'>
										{getInitials(user?.name)}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-semibold text-slate-800 dark:text-slate-100 truncate'>
											{user?.name || 'Guest'}
										</p>
										<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
											{user?.email || 'guest@company.com'}
										</p>
									</div>
								</div>
							</div>

							{/* Menu Items */}
							<div className='py-2'>
								<button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group'>
									<User className='w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
									<span>Profile</span>
								</button>

								<button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group'>
									<Settings className='w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
									<span>Settings</span>
								</button>

								<button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group'>
									<Bell className='w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
									<span>Notifications</span>
									{hasNotifications && (
										<span className='ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full'>
											3
										</span>
									)}
								</button>
							</div>

							{/* Divider */}
							<div className='h-px bg-slate-200 dark:bg-slate-800' />

							{/* Logout */}
							<div className='py-2'>
								<button
									onClick={logoutUser}
									className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group'
								>
									<LogOut className='w-4 h-4' />
									<span className='font-medium'>Logout</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
