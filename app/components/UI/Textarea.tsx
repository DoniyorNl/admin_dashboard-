import clsx from 'clsx'
import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
	className?: string
}

export default function Textarea({ label, error, className, ...props }: TextareaProps) {
	return (
		<div className='flex flex-col w-full'>
			{label && (
				<label className='text-sm font-medium mb-1 text-slate-700 dark:text-slate-300'>
					{label}
				</label>
			)}
			<textarea
				{...props}
				className={clsx(
					'w-full py-2 px-4 border rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 placeholder-slate-400 dark:placeholder-slate-500 transition-all',
					error
						? 'border-red-500 focus:ring-red-500'
						: 'border-slate-200 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400',
					'bg-white dark:bg-slate-800',
					className,
				)}
			/>
			{error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
		</div>
	)
}
