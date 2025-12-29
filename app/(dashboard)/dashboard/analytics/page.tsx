'use client'

import { AlertCircle, BarChart2, DollarSign, TrendingUp, Users } from 'lucide-react'
import { useAnalytics } from './hooks/useAnalytics'

import ChannelCard from '@/components/features/analytics/ChannelCard'
import ChannelCardSkeleton from '@/components/features/analytics/ChannelCardSkeleton'
import KpiCard from '@/components/features/analytics/KpiCard'
import KpiCardSkeleton from '@/components/features/analytics/KpiCardSkeleton'
import RevenueChart from '@/components/features/analytics/RevenueChart'
import RevenueChartSkeleton from '@/components/features/analytics/RevenueChartSkeleton'

// KPI configuration - maintainable and type-safe
const KPI_CONFIG = {
	revenue: {
		title: 'Revenue',
		icon: <DollarSign className='w-4 h-4 text-amber-600' />,
		formatter: (value: number) => `$${value.toLocaleString()}`,
	},
	users: {
		title: 'Users',
		icon: <Users className='w-4 h-4 text-sky-600' />,
		formatter: (value: number) => value.toLocaleString(),
	},
	orders: {
		title: 'Orders',
		icon: <BarChart2 className='w-4 h-4 text-green-600' />,
		formatter: (value: number) => value.toLocaleString(),
	},
	aov: {
		title: 'Avg. Order',
		icon: <TrendingUp className='w-4 h-4 text-violet-600' />,
		formatter: (value: number) => `$${value.toFixed(2)}`,
	},
} as const

export default function AnalyticsPage() {
	const { range, setRange, loading, error, kpis, revenueSeries, channels, recentOrders } =
		useAnalytics()

	// Loading state
	if (loading) {
		return (
			<div className='space-y-4'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<KpiCardSkeleton />
					<KpiCardSkeleton />
					<KpiCardSkeleton />
					<KpiCardSkeleton />
				</div>

				<RevenueChartSkeleton />

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
					<div className='space-y-3'>
						<ChannelCardSkeleton />
						<ChannelCardSkeleton />
						<ChannelCardSkeleton />
					</div>
					<div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-64 animate-pulse'></div>
				</div>
			</div>
		)
	}

	// Error state - improved UX
	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md'>
					<div className='flex items-start gap-3'>
						<AlertCircle className='w-6 h-6 text-red-600 flex-shrink-0 mt-0.5' />
						<div>
							<h3 className='text-lg font-semibold text-red-900 dark:text-red-100 mb-2'>
								Failed to Load Analytics
							</h3>
							<p className='text-sm text-red-700 dark:text-red-200 mb-4'>{error}</p>
							<button
								onClick={() => window.location.reload()}
								className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors'
							>
								Retry
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// Check if data exists (with optional chaining for safety)
	const hasKpis = kpis ? Object.keys(kpis).length > 0 : false
	const hasRevenue = revenueSeries?.length > 0
	const hasChannels = channels?.length > 0
	const hasOrders = recentOrders?.length > 0

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Analytics</h1>
					<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
						Overview of key metrics and trends
					</p>
				</div>

				{/* Range Control - moved to top */}
				<div className='flex gap-2'>
					{(['7d', '30d', '90d'] as const).map(r => (
						<button
							key={r}
							onClick={() => setRange(r)}
							disabled={loading}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								range === r
									? 'bg-blue-600 text-white shadow-sm'
									: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
							} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{/* KPI Cards */}
			{hasKpis && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{Object.entries(kpis).map(([key, metric]) => {
						const config = KPI_CONFIG[key as keyof typeof KPI_CONFIG]

						// Skip if no config (defensive programming)
						if (!config) return null

						return (
							<KpiCard
								key={key}
								title={config.title}
								value={config.formatter(metric.value)}
								delta={metric.delta}
								trend={metric.trend}
								icon={config.icon}
							/>
						)
					})}
				</div>
			)}

			{/* Revenue Chart */}
			{hasRevenue && <RevenueChart data={revenueSeries} />}

			{/* Channels + Orders */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				{/* Top Channels */}
				{hasChannels && (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
						<h2 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3'>
							Top Channels
						</h2>
						<div className='space-y-3'>
							{channels.map(channel => (
								<ChannelCard
									key={channel.name}
									name={channel.name}
									share={channel.share}
									trend={channel.trend}
								/>
							))}
						</div>
					</div>
				)}

				{/* Recent Orders */}
				{hasOrders && (
					<div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
						<h2 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3'>
							Recent Orders
						</h2>
						<ul className='space-y-2'>
							{recentOrders.map(order => (
								<li
									key={order.id}
									className='flex items-center justify-between text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded transition-colors'
								>
									<div>
										<p className='font-medium text-slate-800 dark:text-slate-100'>
											Order #{order.id}
										</p>
										<p className='text-slate-500 dark:text-slate-400'>${order.amount.toFixed(2)}</p>
									</div>
									<span className='text-xs text-slate-500 dark:text-slate-400'>
										{order.createdAt}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Empty state */}
			{!hasKpis && !hasRevenue && !hasChannels && !hasOrders && (
				<div className='flex flex-col items-center justify-center min-h-[400px] text-center space-y-3'>
					<BarChart2 className='w-16 h-16 text-slate-300 dark:text-slate-600' />
					<h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
						No Data Available
					</h3>
					<p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm'>
						Analytics data will appear here once available. Try selecting a different time range.
					</p>
				</div>
			)}
		</div>
	)
}
