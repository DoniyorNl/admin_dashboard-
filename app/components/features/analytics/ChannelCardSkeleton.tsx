export default function ChannelCardSkeleton() {
	return (
		<div className='flex items-center justify-between animate-pulse'>
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-md'></div>
				<div className='space-y-1'>
					<div className='h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded'></div>
					<div className='h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded'></div>
				</div>
			</div>
			<div className='w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded'></div>
		</div>
	)
}
