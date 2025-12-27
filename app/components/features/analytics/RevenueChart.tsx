// components/features/analytics/RevenueChart.tsx
import AreaChart from './AreaChart'

interface RevenuePoint {
	date: string
	value: number
}

interface RevenueChartProps {
	data: RevenuePoint[]
}

/**
 * RevenueChart
 *
 * - Revenue time-series ni ko‘rsatadi
 * - Chart rendering uchun AreaChart'dan foydalanadi
 * - Page componentni chart logikasidan ozod qiladi
 */
export default function RevenueChart({ data }: RevenueChartProps) {
	// Faqat value'larni chart uchun chiqaramiz
	const values = data.map(point => point.value)

	return (
		<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
			{/* Header */}
			<div className='flex items-center justify-between mb-3'>
				<div>
					<h2 className='text-lg font-semibold text-slate-800 dark:text-slate-100'>
						Revenue Over Time
					</h2>
					<p className='text-sm text-slate-500 dark:text-slate-400'>Selected period</p>
				</div>
			</div>

			{/* Chart */}
			<div className='w-full h-56'>
				<AreaChart data={values} color='#3930eb' />
			</div>
		</div>
	)
}
