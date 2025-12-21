// components/Sidebar.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import {
	LayoutDashboard,
	Users,
	ShoppingCart,
	Package,
	BarChart3,
	Settings,
	FileText,
	Calendar,
	MessageSquare,
	Folder,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'

interface SidebarProps {
	isCollapsed: boolean
	setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
	const router = useRouter()
	const pathname = usePathname()

	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', badge: null },
		{ id: 'users', label: 'Users', icon: Users, href: '/dashboard/users', badge: '24' },
		{ id: 'products', label: 'Products', icon: Package, href: '/dashboard/products', badge: null },
		{ id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/dashboard/orders', badge: '12' },
		{
			id: 'analytics',
			label: 'Analytics',
			icon: BarChart3,
			href: '/dashboard/analytics',
			badge: null,
		},
		{
			id: 'messages',
			label: 'Messages',
			icon: MessageSquare,
			href: '/dashboard/messages',
			badge: '5',
		},
		{ id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard/calendar', badge: null },
		{
			id: 'documents',
			label: 'Documents',
			icon: FileText,
			href: '/dashboard/documents',
			badge: null,
		},
		{ id: 'files', label: 'Files', icon: Folder, href: '/dashboard/files', badge: null },
	]

	const bottomItems = [
		{ id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings', badge: null },
	]

	const handleNavigation = (href: string) => {
		router.push(href)
	}

	return (
		<div
			className={`relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
				isCollapsed ? 'w-20' : 'w-64'
			}`}
		>
			{/* Collapse Toggle Button */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className='absolute -right-3 top-8 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm z-10'
			>
				{isCollapsed ? (
					<ChevronRight className='w-3.5 h-3.5 text-slate-600 dark:text-slate-400' />
				) : (
					<ChevronLeft className='w-3.5 h-3.5 text-slate-600 dark:text-slate-400' />
				)}
			</button>

			{/* Sidebar Content */}
			<div className='flex flex-col h-full py-6'>
				{/* Logo Area */}
				<div className='px-4 mb-8'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex-shrink-0'>
							AD
						</div>
						{!isCollapsed && (
							<div className='flex flex-col'>
								<span className='text-sm font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
									Admin
								</span>
								<span className='text-xs text-slate-500 dark:text-slate-400'>Dashboard</span>
							</div>
						)}
					</div>
				</div>

				{/* Main Menu Items */}
				<nav className='flex-1 px-3 overflow-y-auto'>
					<div className='space-y-1'>
						{menuItems.map(item => {
							const Icon = item.icon
							const isActive = pathname === item.href

							return (
								<button
									key={item.id}
									onClick={() => handleNavigation(item.href)}
									className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
										isActive
											? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
											: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
									}`}
								>
									{/* Active Indicator */}
									{isActive && (
										<div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full' />
									)}

									<Icon
										className={`w-5 h-5 flex-shrink-0 ${
											isActive ? 'text-blue-600 dark:text-blue-400' : ''
										}`}
									/>

									{!isCollapsed && (
										<>
											<span className='text-sm font-medium flex-1 text-left'>{item.label}</span>
											{item.badge && (
												<span
													className={`text-xs px-2 py-0.5 rounded-full font-medium ${
														isActive
															? 'bg-blue-600 dark:bg-blue-500 text-white'
															: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
													}`}
												>
													{item.badge}
												</span>
											)}
										</>
									)}

									{/* Tooltip for collapsed state */}
									{isCollapsed && (
										<div className='absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
											{item.label}
											{item.badge && (
												<span className='ml-1 px-1.5 py-0.5 bg-slate-700 dark:bg-slate-600 rounded-full'>
													{item.badge}
												</span>
											)}
										</div>
									)}
								</button>
							)
						})}
					</div>

					{/* Divider */}
					<div className='my-4 h-px bg-slate-200 dark:bg-slate-800' />

					{/* Bottom Items */}
					<div className='space-y-1'>
						{bottomItems.map(item => {
							const Icon = item.icon
							const isActive = pathname === item.href

							return (
								<button
									key={item.id}
									onClick={() => handleNavigation(item.href)}
									className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
										isActive
											? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
											: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
									}`}
								>
									{isActive && (
										<div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full' />
									)}

									<Icon
										className={`w-5 h-5 flex-shrink-0 ${
											isActive ? 'text-blue-600 dark:text-blue-400' : ''
										}`}
									/>

									{!isCollapsed && (
										<span className='text-sm font-medium flex-1 text-left'>{item.label}</span>
									)}

									{isCollapsed && (
										<div className='absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
											{item.label}
										</div>
									)}
								</button>
							)
						})}
					</div>
				</nav>

				{/* User Info at Bottom */}
				{!isCollapsed && (
					<div className='px-4 pt-4 border-t border-slate-200 dark:border-slate-800'>
						<div className='flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50'>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/20'>
								JD
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-slate-800 dark:text-slate-100 truncate'>
									John Doe
								</p>
								<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>Administrator</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
