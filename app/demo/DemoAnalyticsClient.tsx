'use client'

import { AlertCircle, BarChart2, BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import ChannelCard from '@/components/features/analytics/ChannelCard'
import ChannelCardSkeleton from '@/components/features/analytics/ChannelCardSkeleton'
import KpiCard from '@/components/features/analytics/KpiCard'
import KpiCardSkeleton from '@/components/features/analytics/KpiCardSkeleton'
import RevenueChart from '@/components/features/analytics/RevenueChart'
import RevenueChartSkeleton from '@/components/features/analytics/RevenueChartSkeleton'

type AnalyticsRange = '7d' | '30d' | '90d'

type KpiMetric = {
	value: number
	delta: number
	trend: 'up' | 'down'
}

type RevenuePoint = { date: string; value: number }
type ChannelMetric = { name: string; share: number; trend: number[] }
type RecentOrder = { id: number; amount: number; createdAt: string }

type AnalyticsResponse = {
	kpis: Record<string, KpiMetric>
	revenueSeries: RevenuePoint[]
	channels: ChannelMetric[]
	recentOrders: RecentOrder[]
}

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
		icon: <BarChart3 className='w-4 h-4 text-green-600' />,
		formatter: (value: number) => value.toLocaleString(),
	},
	aov: {
		title: 'Avg. Order',
		icon: <TrendingUp className='w-4 h-4 text-violet-600' />,
		formatter: (value: number) => `$${value.toFixed(2)}`,
	},
} as const

export default function DemoAnalyticsClient() {
	const [range, setRange] = useState<AnalyticsRange>('30d')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<AnalyticsResponse | null>(null)

	useEffect(() => {
		let active = true
		const controller = new AbortController()

		const run = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`/api/analytics?range=${range}`, { signal: controller.signal })
				if (!res.ok) throw new Error('Failed to fetch')
				const body = (await res.json()) as AnalyticsResponse
				if (!active) return
				setData(body)
			} catch {
				if (!active || controller.signal.aborted) return
				setError('Failed to load analytics data')
				setData(null)
			} finally {
				if (!active) return
				setLoading(false)
			}
		}

		run()
		return () => {
			active = false
			controller.abort()
		}
	}, [range])

	const has = useMemo(() => {
		const kpis = data?.kpis && Object.keys(data.kpis).length > 0
		const revenue = (data?.revenueSeries?.length ?? 0) > 0
		const channels = (data?.channels?.length ?? 0) > 0
		const orders = (data?.recentOrders?.length ?? 0) > 0
		return { kpis, revenue, channels, orders }
	}, [data])

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
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
						<div className='space-y-3'>
							<ChannelCardSkeleton />
							<ChannelCardSkeleton />
							<ChannelCardSkeleton />
						</div>
					</div>
					<div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-64 animate-pulse'></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[300px] space-y-4'>
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

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between flex-wrap gap-4'>
				<div>
					<h2 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Analytics</h2>
					<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
						Overview of key metrics and trends (demo data)
					</p>
				</div>

				<div className='flex gap-2'>
					{(['7d', '30d', '90d'] as const).map(r => (
						<button
							key={r}
							onClick={() => setRange(r)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								range === r
									? 'bg-blue-600 text-white shadow-sm'
									: 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
							}`}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{has.kpis && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{Object.entries(data!.kpis).map(([key, metric]) => {
						const config = KPI_CONFIG[key as keyof typeof KPI_CONFIG]
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

			{has.revenue && <RevenueChart data={data!.revenueSeries} />}

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				{has.channels && (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
						<h3 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3'>Top Channels</h3>
						<div className='space-y-3'>
							{data!.channels.map(ch => (
								<ChannelCard key={ch.name} name={ch.name} share={ch.share} trend={ch.trend} />
							))}
						</div>
					</div>
				)}

				{has.orders && (
					<div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
						<h3 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3'>Recent Orders</h3>
						<ul className='space-y-2'>
							{data!.recentOrders.map(order => (
								<li
									key={order.id}
									className='flex items-center justify-between text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded transition-colors'
								>
									<div>
										<p className='font-medium text-slate-800 dark:text-slate-100'>Order #{order.id}</p>
										<p className='text-slate-500 dark:text-slate-400'>${order.amount.toFixed(2)}</p>
									</div>
									<span className='text-xs text-slate-500 dark:text-slate-400'>{order.createdAt}</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{!has.kpis && !has.revenue && !has.channels && !has.orders && (
				<div className='flex flex-col items-center justify-center min-h-[250px] text-center space-y-3'>
					<BarChart2 className='w-14 h-14 text-slate-300 dark:text-slate-600' />
					<h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300'>No Data Available</h3>
					<p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm'>
						Demo analytics data will appear here once available.
					</p>
				</div>
			)}
		</div>
	)
}

