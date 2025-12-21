'use client'

import { useState } from 'react'
import Protected from './components/Protected'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
	const [activeItem, setActiveItem] = useState('dashboard')

	return (
		<Protected>
			<div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
				<div className='flex h-screen overflow-hidden'>
					{/* Sidebar - Desktop */}
					<aside className='hidden lg:block flex-shrink-0'>
						<Sidebar
							isCollapsed={isSidebarCollapsed}
							setIsCollapsed={setIsSidebarCollapsed}
							activeItem={activeItem}
							setActiveItem={setActiveItem}
						/>
					</aside>

					{/* Main Content Area */}
					<div className='flex flex-1 flex-col min-w-0'>
						{/* Header */}
						<header className='h-16 flex-shrink-0 sticky top-0 z-40'>
							<Header />
						</header>

						{/* Main Content */}
						<main className='dashboard-main overflow-y-auto flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950'>
							<div className='px-4 py-6 sm:px-6 lg:px-8'>{children}</div>
						</main>
					</div>
				</div>
			</div>
		</Protected>
	)
}
