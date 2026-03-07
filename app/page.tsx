import Link from 'next/link'
import {
	ArrowRight,
	BarChart3,
	LayoutDashboard,
	LockKeyhole,
	Settings2,
	Sparkles,
	Zap,
} from 'lucide-react'
import { SITE_DESCRIPTION, SITE_NAME } from 'lib/config/site'

export default function Home() {
	return (
		<div className='relative overflow-hidden'>
			{/* Background */}
			<div aria-hidden className='absolute inset-0 -z-10'>
				<div className='absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_0%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(900px_circle_at_60%_90%,rgba(16,185,129,0.10),transparent_60%)]' />
				<div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0.04))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]' />
				<div className='absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-blue-500/15 to-emerald-400/10 blur-3xl' />
				<div className='absolute inset-0 [background-image:radial-gradient(rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.18] dark:opacity-[0.08]' />
			</div>

			{/* Top nav */}
			<header className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8'>
				<nav className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center shadow-lg shadow-blue-500/25'>
							AD
						</div>
						<div className='leading-tight'>
							<div className='text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
								{SITE_NAME}
							</div>
							<div className='text-xs text-slate-500 dark:text-slate-400'>Next.js App Router • Tailwind</div>
						</div>
					</div>

					<div className='hidden sm:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300'>
						<Link className='hover:text-slate-900 dark:hover:text-white transition-colors' href='/demo'>
							Demo
						</Link>
						<Link className='hover:text-slate-900 dark:hover:text-white transition-colors' href='/login'>
							Login
						</Link>
						<Link
							className='inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition'
							href='/register'
						>
							Get started
						</Link>
					</div>
				</nav>
			</header>

			<main>
				{/* Hero */}
				<section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12'>
					<div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-center'>
						<div className='lg:col-span-7'>
							<div className='inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200'>
								<Sparkles className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />
								Portfolio-ready UI polish • Public demo • Auth included
							</div>

							<h1 className='mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'>
								A modern admin dashboard that looks and feels production-grade.
							</h1>
							<p className='mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl'>
								{SITE_DESCRIPTION} Try the public demo for Lighthouse/recruiters, or sign in to explore the full
								app experience.
							</p>

							<div className='mt-8 flex flex-col sm:flex-row gap-3'>
								<Link
									href='/demo'
									className='inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition'
								>
									Try the demo
									<ArrowRight className='w-4 h-4' />
								</Link>
								<div className='flex gap-3'>
									<Link
										href='/login'
										className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition'
									>
										Login
									</Link>
									<Link
										href='/register'
										className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition'
									>
										Register
									</Link>
								</div>
							</div>

							<div className='mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl'>
								<div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-4'>
									<div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>Public demo</div>
									<div className='text-xs text-slate-600 dark:text-slate-400 mt-1'>No auth wall for audits</div>
								</div>
								<div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-4'>
									<div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>Theming</div>
									<div className='text-xs text-slate-600 dark:text-slate-400 mt-1'>Dark/light mode ready</div>
								</div>
								<div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-4'>
									<div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>UX details</div>
									<div className='text-xs text-slate-600 dark:text-slate-400 mt-1'>Skeletons + micro motion</div>
								</div>
							</div>
						</div>

						{/* Preview card */}
						<div className='lg:col-span-5'>
							<div className='relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-xl overflow-hidden'>
								<div className='p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center'>
											AD
										</div>
										<div>
											<div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>Demo snapshot</div>
											<div className='text-xs text-slate-500 dark:text-slate-400'>Analytics • KPIs • Trends</div>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<span className='h-2 w-2 rounded-full bg-emerald-500/80' />
										<span className='text-xs text-slate-500 dark:text-slate-400'>Live demo</span>
									</div>
								</div>

								<div className='p-5'>
									<div className='grid grid-cols-3 gap-3'>
										{[
											{ label: 'Revenue', value: '$128.4k', tint: 'from-amber-500/20 to-transparent' },
											{ label: 'Users', value: '24.1k', tint: 'from-sky-500/20 to-transparent' },
											{ label: 'Orders', value: '3,942', tint: 'from-emerald-500/20 to-transparent' },
										].map(card => (
											<div
												key={card.label}
												className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3'
											>
												<div className='text-[11px] text-slate-500 dark:text-slate-400'>{card.label}</div>
												<div className='text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1'>
													{card.value}
												</div>
												<div className={`mt-3 h-10 rounded-xl bg-gradient-to-r ${card.tint}`} />
											</div>
										))}
									</div>

									<div className='mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4'>
										<div className='flex items-center justify-between mb-3'>
											<div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
												Revenue trend
											</div>
											<div className='text-xs text-slate-500 dark:text-slate-400'>Last 30 days</div>
										</div>
										<div className='h-28 rounded-2xl bg-[radial-gradient(circle_at_10%_40%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(37,99,235,0.18),transparent_55%)] border border-slate-200/60 dark:border-slate-800/60' />
									</div>

									<div className='mt-4 grid grid-cols-2 gap-3'>
										<div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4'>
											<div className='text-[11px] text-slate-500 dark:text-slate-400'>Top channel</div>
											<div className='mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100'>Organic</div>
											<div className='mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
												<div className='h-full w-[62%] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full' />
											</div>
										</div>
										<div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4'>
											<div className='text-[11px] text-slate-500 dark:text-slate-400'>Error budget</div>
											<div className='mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100'>Healthy</div>
											<div className='mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
												<div className='h-full w-[86%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full' />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features */}
				<section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12'>
					<div className='flex items-end justify-between gap-6 flex-wrap'>
						<div>
							<h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
								What you can showcase
							</h2>
							<p className='mt-2 text-slate-600 dark:text-slate-300 max-w-2xl'>
								Designed to be recruiter-friendly: the demo is public, the UI is clean, and the architecture is
								organized for real-world scaling.
							</p>
						</div>
						<Link
							href='/demo'
							className='inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors'
						>
							Open demo <ArrowRight className='w-4 h-4' />
						</Link>
					</div>

					<div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{[
							{
								title: 'Analytics-first UI',
								desc: 'KPIs, trends, channel breakdowns, skeleton loading, and resilient empty/error states.',
								icon: <BarChart3 className='w-5 h-5 text-indigo-600 dark:text-indigo-300' />,
							},
							{
								title: 'Dashboard layout system',
								desc: 'Sidebar + header shell, responsive spacing, and ergonomic page structure.',
								icon: <LayoutDashboard className='w-5 h-5 text-blue-600 dark:text-blue-300' />,
							},
							{
								title: 'Auth + protected routes',
								desc: 'Server-side redirect for private routes plus client guards for smooth UX.',
								icon: <LockKeyhole className='w-5 h-5 text-emerald-600 dark:text-emerald-300' />,
							},
							{
								title: 'Settings & preferences',
								desc: 'Theme switching and settings surface that can grow into a full preferences system.',
								icon: <Settings2 className='w-5 h-5 text-violet-600 dark:text-violet-300' />,
							},
							{
								title: 'Performance-minded defaults',
								desc: 'Font optimization via `next/font`, clean metadata, and sane Next.js production defaults.',
								icon: <Zap className='w-5 h-5 text-amber-600 dark:text-amber-300' />,
							},
							{
								title: 'Polished visual identity',
								desc: 'Custom app icons, OpenGraph images, and a cohesive landing page to remove boilerplate vibes.',
								icon: <Sparkles className='w-5 h-5 text-slate-700 dark:text-slate-200' />,
							},
						].map(f => (
							<div
								key={f.title}
								className='rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-6 hover:bg-white dark:hover:bg-slate-900 transition'
							>
								<div className='w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center'>
									{f.icon}
								</div>
								<h3 className='mt-4 text-base font-semibold text-slate-900 dark:text-slate-100'>{f.title}</h3>
								<p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>{f.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16'>
					<div className='rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white overflow-hidden relative'>
						<div aria-hidden className='absolute inset-0 opacity-60 bg-[radial-gradient(900px_circle_at_20%_30%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(900px_circle_at_80%_10%,rgba(37,99,235,0.22),transparent_55%),radial-gradient(900px_circle_at_60%_90%,rgba(16,185,129,0.16),transparent_60%)]' />
						<div className='relative p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
							<div>
								<h2 className='text-2xl font-bold tracking-tight'>Run the demo, then dive deeper.</h2>
								<p className='mt-2 text-white/80 max-w-2xl'>
									Use <span className='font-semibold'>/demo</span> for quick audits. Use auth pages for the full
									dashboard shell.
								</p>
							</div>
							<div className='flex gap-3'>
								<Link
									href='/demo'
									className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition'
								>
									Open demo
								</Link>
								<Link
									href='/login'
									className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/25 hover:bg-white/10 transition'
								>
									Login
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
