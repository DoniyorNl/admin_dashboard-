// src/components/Input.tsx
'use client'
import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string
	error?: string
}

export default function Input({ label, error, className, ...props }: InputProps) {
	return (
		<div className='flex flex-col w-full'>
			{label && <label className='mb-1 text-gray-700 dark:text-gray-300'>{label}</label>}
			<input
				className={clsx(
					'px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-accent',
					error && 'border-red-500',
					className,
				)}
				{...props}
			/>
			{error && <span className='text-red-500 text-sm mt-1'>{error}</span>}
		</div>
	)
}
