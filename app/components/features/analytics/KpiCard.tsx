import { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import clsx from 'clsx'

interface KpiCardProps {
	title: string
	value: string | number
	delta?: number
	trend?: 'up' | 'down'
	icon?: ReactNode
}

export default function KpiCard({ title, value, delta, trend, icon }: KpiCardProps) {
	const isUp = trend === 'up'

	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4'>
			<div className='flex items-center justify-between'>
				<p className='text-sm text-slate-600 dark:text-slate-400'>{title}</p>
				{icon && (
					<div className='w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
						{icon}
					</div>
				)}
			</div>

			<div className='mt-2'>
				<p className='text-2xl font-semibold text-slate-900 dark:text-slate-100'>{value}</p>

				{delta !== undefined && trend && (
					<div
						className={clsx(
							'mt-1 inline-flex items-center text-sm font-medium',
							isUp ? 'text-emerald-600' : 'text-red-600',
						)}
					>
						{isUp ? (
							<ArrowUpRight className='w-4 h-4 mr-1' />
						) : (
							<ArrowDownRight className='w-4 h-4 mr-1' />
						)}
						{delta}%
					</div>
				)}
			</div>
		</div>
	)
}
