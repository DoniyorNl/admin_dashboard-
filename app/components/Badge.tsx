'use client'
import { ReactNode } from 'react'
import clsx from 'clsx'

type BadgeProps = {
	children: ReactNode
	color?: 'blue' | 'green' | 'red' | 'gray'
	className?: string
}

const colorClasses = {
	blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
	green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
	red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
	gray: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export default function Badge({ children, color = 'blue', className }: BadgeProps) {
	return (
		<span
			className={clsx(
				'inline-block px-2 py-1 rounded-full text-sm font-medium',
				colorClasses[color],
				className,
			)}
		>
			{children}
		</span>
	)
}
