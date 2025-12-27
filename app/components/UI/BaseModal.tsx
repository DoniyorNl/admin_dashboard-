// components/ui/BaseModal.tsx
'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

type BaseModalProps = {
	children: ReactNode
	onClose: () => void
	title?: string
}

export default function BaseModal({ children, onClose, title }: BaseModalProps) {
	return (
		<div
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
			onClick={onClose}
		>
			<div
				className='bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800'>
					<h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>{title}</h2>
					<button onClick={onClose}>
						<X />
					</button>
				</div>

				{children}
			</div>
		</div>
	)
}
