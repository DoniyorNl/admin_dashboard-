'use client'

import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import clsx from 'clsx' 

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'danger'
	children: ReactNode
	fullWidth?: boolean
	size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
	primary: 'bg-primary text-white hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark',
	secondary:
		'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
	danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
}

const sizeClasses = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-5 py-3 text-lg',
}

const Button: FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	className,
	children,
	...props
}) => {
	return (
		<button
			className={clsx(
				'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed',
				variantClasses[variant],
				sizeClasses[size],
				fullWidth && 'w-full',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
