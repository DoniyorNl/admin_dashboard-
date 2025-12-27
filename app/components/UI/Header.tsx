'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, Bell, Search, Menu, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Header() {
	const [username, setUsername] = useState<string | null>(null)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [hasNotifications, setHasNotifications] = useState(true)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const searchRef = useRef<HTMLDivElement | null>(null)
	const { theme, setTheme, systemTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	// Cookie'dan username olish
	useEffect(() => {
		const name =
			document.cookie
				.split('; ')
				.find(row => row.startsWith('username='))
				?.split('=')[1] || null
		setUsername(name)
	}, [])

	// Dropdown yoki search tashqarisiga bosilganda yopish
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsDropdownOpen(false)
			if (searchRef.current && !searchRef.current.contains(target)) setIsSearchOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Logout
	const handleLogout = async () => {
		setIsDropdownOpen(false)
		try {
			await fetch('/authAPI/logout', { method: 'POST' })
			document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
			window.location.href = '/login'
		} catch (error) {
			console.error('Logout error:', error)
			alert('Logout failed. Please try again.')
		}
	}

	const getInitials = (name: string | null) => {
		if (!name) return 'G'
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	if (!mounted) return null // SSR bilan moslashuv

	// Dark mode aniqlash
	const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
	const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark')

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
				<button className='relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
					<Bell className='w-5 h-5 text-slate-600 dark:text-slate-300' />
					{hasNotifications && (
						<span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse' />
					)}
				</button>

				<div className='hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2' />

				{/* User Dropdown */}
				<div ref={dropdownRef} className='relative'>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className='flex items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group'
					>
						<span className='hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200'>
							{username || 'Guest'}
						</span>

						<div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-105'>
							{getInitials(username)}
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
										{getInitials(username)}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-semibold text-slate-800 dark:text-slate-100 truncate'>
											{username || 'Guest'}
										</p>
										<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
											{username
												? `${username.toLowerCase().replace(/\s+/g, '.')}@company.com`
												: 'guest@company.com'}
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
									onClick={handleLogout}
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
