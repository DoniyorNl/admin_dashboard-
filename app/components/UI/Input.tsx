import { InputHTMLAttributes, JSX, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	icon?: JSX.Element
	rightElement?: ReactNode
	className?: string
}

export default function Input({
	label,
	error,
	className,
	icon,
	rightElement,
	...props
}: InputProps) {
	return (
		<div className='flex flex-col w-full'>
			{label && (
				<label className='text-sm font-medium mb-1 text-slate-700 dark:text-slate-300'>
					{label}
				</label>
			)}
			<div className='relative'>
				{icon && (
					<div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400'>
						{icon}
					</div>
				)}
				<input
					{...props}
					className={clsx(
						'w-full py-2 border rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 placeholder-slate-400 dark:placeholder-slate-500 transition-all',
						icon ? 'pl-10' : 'pl-4',
						rightElement ? 'pr-10' : 'pr-4',
						error
							? 'border-red-500 focus:ring-red-500'
							: 'border-slate-200 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400',
						'bg-white dark:bg-slate-800',
						className,
					)}
				/>
				{rightElement && (
					<div className='absolute right-3 top-1/2 -translate-y-1/2'>{rightElement}</div>
				)}
			</div>
			{error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
		</div>
	)
}
