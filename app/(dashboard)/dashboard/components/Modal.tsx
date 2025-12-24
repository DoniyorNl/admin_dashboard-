// components/Modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Product, ProductStatus } from '@/types/products'
import Button from '@/components/Button'

interface ModalProps {
	initialData: Product | null
	onClose: () => void
	onSave: (product: Product) => void
}

export default function Modal({ initialData, onClose, onSave }: ModalProps) {
	const [formData, setFormData] = useState<Partial<Product>>({
		name: '',
		price: 0,
		category: '',
		status: 'active',
		description: '',
		image: '',
	})

	// Edit mode bo'lsa, ma'lumotlarni yuklash
	useEffect(() => {
		if (initialData) {
			setFormData(initialData)
		}
	}, [initialData])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const product: Product = {
			id: initialData?.id || Date.now(),
			name: formData.name || '',
			price: formData.price || 0,
			category: formData.category || '',
			status: formData.status || 'active',
			description: formData.description,
			image: formData.image,
			createdAt: initialData?.createdAt || new Date().toISOString(),
		}

		onSave(product)
		onClose()
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: name === 'price' ? parseFloat(value) || 0 : value,
		}))
	}

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800'>
					<h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>
						{initialData ? 'Edit Product' : 'Add New Product'}
					</h2>
					<button
						onClick={onClose}
						className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
					>
						<X className='w-5 h-5 text-slate-600 dark:text-slate-400' />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='p-6 space-y-4'>
					{/* Product Name */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Product Name *
						</label>
						<input
							type='text'
							name='name'
							value={formData.name}
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Enter product name'
						/>
					</div>

					{/* Price */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Price *
						</label>
						<input
							type='number'
							name='price'
							value={formData.price}
							onChange={handleChange}
							required
							min='0'
							step='0.01'
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='0.00'
						/>
					</div>

					{/* Category */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Category *
						</label>
						<input
							type='text'
							name='category'
							value={formData.category}
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='e.g., Electronics, Clothing'
						/>
					</div>

					{/* Status */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Status *
						</label>
						<select
							name='status'
							value={formData.status}
							onChange={handleChange}
							required
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='active'>Active</option>
							<option value='inactive'>Inactive</option>
							<option value='draft'>Draft</option>
							<option value='out_of_stock'>Out of Stock</option>
						</select>
					</div>

					{/* Image URL */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Image URL
						</label>
						<input
							type='url'
							name='image'
							value={formData.image}
							onChange={handleChange}
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='https://example.com/image.jpg'
						/>
					</div>

					{/* Description */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Description
						</label>
						<textarea
							name='description'
							value={formData.description}
							onChange={handleChange}
							rows={4}
							className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Enter product description'
						/>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800'>
						<Button type='button' variant='ghost' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' variant='primary'>
							{initialData ? 'Update Product' : 'Add Product'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
