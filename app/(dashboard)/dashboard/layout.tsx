'use client'

import { useState } from 'react'
import Protected from './components/Protected'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)

	return (
		<Protected>
			<div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
				{/* Fixed Sidebar - Desktop */}
				<aside
					className={`hidden lg:block fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
						isSidebarCollapsed ? 'w-20' : 'w-64'
					}`}
				>
					<Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
				</aside>

				{/* Fixed Header */}
				<header
					className={`fixed top-0 right-0 h-16 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ${
						isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
					} left-0`}
				>
					<Header />
				</header>

				{/* Main Content Area */}
				<main
					className={`mt-16 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 transition-all duration-300 ${
						isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
					}`}
				>
					<div className='px-4 py-4 sm:px-6 lg:px-8'>{children}</div>
				</main>
			</div>
		</Protected>
	)
}
