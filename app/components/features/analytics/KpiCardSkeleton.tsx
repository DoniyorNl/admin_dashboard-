export default function KpiCardSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse'>
			<div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 mb-2 rounded'></div>
			<div className='h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded'></div>
			<div className='h-3 w-10 bg-slate-200 dark:bg-slate-700 mt-2 rounded'></div>
		</div>
	)
}
