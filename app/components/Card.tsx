// src/components/Card.tsx
'use client'
import { ReactNode } from 'react'
import clsx from 'clsx'

type CardProps = {
	children: ReactNode
	className?: string
}

export default function Card({ children, className }: CardProps) {
	return (
		<div
			className={clsx(
				'bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors',
				className,
			)}
		>
			{children}
		</div>
	)
}
