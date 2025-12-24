// components/AddProductModal.tsx
import { Product } from '@/types/products'
import Modal from './Modal'
import React from 'react'

type AddProductModalProps = {
	initialData: Product | null
	onClose: () => void
	onSave: (product: Product) => void
}

export default function AddProductModal({ initialData, onClose, onSave }: AddProductModalProps) {
	// Form state
	const [name, setName] = React.useState(initialData?.name || '')
	const [price, setPrice] = React.useState(initialData?.price || 0)
	const [category, setCategory] = React.useState(initialData?.category || '')
	const [status, setStatus] = React.useState(initialData?.status || 'active')

	const handleSubmit = () => {
		const newProduct: Product = {
			id: initialData?.id || Date.now(),
			name,
			price,
			category,
			status,
			description: initialData?.description || '',
			image: initialData?.image || '',
			createdAt: initialData?.createdAt || new Date().toISOString(),
		}

		onSave(newProduct)
		onClose()
	}

	return (
		<Modal onClose={onClose}>
			<div className='space-y-4 p-4'>
				<input
					type='text'
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder='Product Name'
					className='border px-3 py-2 rounded w-full'
				/>
				<input
					type='number'
					value={price}
					onChange={e => setPrice(Number(e.target.value))}
					placeholder='Price'
					className='border px-3 py-2 rounded w-full'
				/>
				<input
					type='text'
					value={category}
					onChange={e => setCategory(e.target.value)}
					placeholder='Category'
					className='border px-3 py-2 rounded w-full'
				/>
				<select
					value={status}
					onChange={e => setStatus(e.target.value as Product['status'])}
					className='border px-3 py-2 rounded w-full'
				>
					<option value='active'>Active</option>
					<option value='inactive'>Inactive</option>
					<option value='draft'>Draft</option>
					<option value='out_of_stock'>Out of Stock</option>
				</select>
				<div className='flex justify-end gap-2'>
					<button onClick={onClose} className='px-4 py-2 border rounded'>
						Cancel
					</button>
					<button onClick={handleSubmit} className='px-4 py-2 bg-blue-600 text-white rounded'>
						Save
					</button>
				</div>
			</div>
		</Modal>
	)
}
