import Link from 'next/link'
import DemoAnalyticsClient from './DemoAnalyticsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Public Demo',
	description: 'Public, recruiter-friendly demo view of the admin dashboard.',
}

export default function DemoPage() {
	return (
		<div className='min-h-[calc(100vh-4rem)]'>
			<header className='sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur'>
				<div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<Link href='/' className='flex items-center gap-3 group'>
							<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center shadow-lg shadow-blue-500/20'>
								AD
							</div>
							<div className='leading-tight'>
								<div className='text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:opacity-90 transition'>
									Public Demo
								</div>
								<div className='text-xs text-slate-500 dark:text-slate-400'>No login required</div>
							</div>
						</Link>
					</div>

					<div className='flex items-center gap-2'>
						<Link
							href='/'
							className='hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 transition'
						>
							Home
						</Link>
						<Link
							href='/login'
							className='inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 transition'
						>
							Login
						</Link>
						<Link
							href='/register'
							className='inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition'
						>
							Register
						</Link>
					</div>
				</div>
			</header>

			<main className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
				<div className='rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-6'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
								Dashboard demo (read-only)
							</h1>
							<p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
								This page is intentionally public for Lighthouse and recruiter reviews. Data is demo-only.
							</p>
						</div>
						<div className='flex gap-2'>
							<Link
								href='/dashboard'
								className='inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition'
							>
								Go to full app (requires login)
							</Link>
						</div>
					</div>
				</div>

				<DemoAnalyticsClient />
			</main>
		</div>
	)
}

