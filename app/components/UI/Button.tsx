'use client'

import React, { forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react' // Yaxshiroq spinner uchun

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'gradient' | 'outline'
	fullWidth?: boolean
	size?: 'sm' | 'md' | 'lg' | 'icon'
	loading?: boolean
	icon?: ReactNode
	iconPosition?: 'left' | 'right'
}

const variantClasses = {
	primary:
		'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/30',
	secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
	danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/30',
	success:
		'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-lg shadow-green-500/30',
	ghost:
		'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
	gradient:
		'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/30',
	outline:
		'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
}

const sizeClasses = {
	sm: 'h-9 px-3 text-sm gap-1.5',
	md: 'h-11 px-5 text-base gap-2',
	lg: 'h-13 px-8 text-lg gap-2.5',
	icon: 'h-11 w-11 p-0',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'gradient',
			size = 'md',
			fullWidth = false,
			className = '',
			children,
			loading = false,
			disabled = false,
			icon,
			iconPosition = 'left',
			...props
		},
		ref,
	) => {
		const baseClasses =
			'relative inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]'

		const buttonClasses = clsx(
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			fullWidth && 'w-full',
			loading && 'text-transparent !pointer-events-none', // Loadingda matn ko'rinmaydi, lekin joyi saqlanadi
			className,
		)

		return (
			<button ref={ref} className={buttonClasses} disabled={disabled || loading} {...props}>
				{/* Loading Spinner - Button markazida mutloq joylashgan */}
				{loading && (
					<div className='absolute inset-0 flex items-center justify-center text-current'>
						<Loader2 className='h-5 w-5 animate-spin' />
					</div>
				)}

				{/* Icon va Children */}
				{!loading && icon && iconPosition === 'left' && <span className='shrink-0'>{icon}</span>}

				<span className={clsx('truncate', loading && 'invisible')}>{children}</span>

				{!loading && icon && iconPosition === 'right' && <span className='shrink-0'>{icon}</span>}
			</button>
		)
	},
)

Button.displayName = 'Button'

export default Button
