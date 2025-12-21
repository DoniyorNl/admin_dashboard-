// src/components/Modal.tsx
'use client'
import { ReactNode } from 'react'
import clsx from 'clsx'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null

	return (
		<>
			<div className='fixed inset-0 bg-black/30 z-40' onClick={onClose} />
			<div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative'>
					<button
						onClick={onClose}
						className='absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
					>
						✕
					</button>
					{children}
				</div>
			</div>
		</>
	)
}
