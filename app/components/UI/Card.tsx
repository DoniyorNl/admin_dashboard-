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
				'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2',
				className,
			)}
		>
			{children}
		</div>
	)
}
