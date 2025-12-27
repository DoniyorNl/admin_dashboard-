// components/features/analytics/ChannelCard.tsx
import Sparkline from './Sparkline'

interface ChannelCardProps {
	name: string
	share: number
	trend: number[]
	label?: string
	color?: string
}

export default function ChannelCard({
	name,
	share,
	trend,
	label,
	color = '#10b981',
}: ChannelCardProps) {
	return (
		<div className='flex items-center justify-between'>
			{/* Left side: channel info */}
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-200'>
					{name
						.split(' ')
						.map(word => word[0])
						.join('')
						.slice(0, 2)
						.toUpperCase()}
				</div>

				<div>
					<p className='text-sm font-medium text-slate-800 dark:text-slate-100'>{name}</p>
					<p className='text-xs text-slate-500 dark:text-slate-400'>{share}% of traffic</p>
				</div>
			</div>

			{/* Right side: sparkline */}
			<div className='w-24'>
				<Sparkline data={trend} color={color} />
			</div>
		</div>
	)
}
