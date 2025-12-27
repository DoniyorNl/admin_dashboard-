'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Product } from '@/types/products'
import BaseModal from '@/components/UI/BaseModal'

type Props = {
	initialData: Product | null
	onClose: () => void
	onSave: (product: Product) => void
}

export default function AddProductModal({ initialData, onClose, onSave }: Props) {
	const [formData, setFormData] = useState<Partial<Product>>({
		name: '',
		price: 0,
		category: '',
		status: 'active',
		description: '',
		image: '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (initialData) {
			setFormData(initialData)
		} else {
			setFormData({
				name: '',
				price: 0,
				category: '',
				status: 'active',
				description: '',
				image: '',
			})
		}
	}, [initialData])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: name === 'price' ? parseFloat(value) || 0 : value,
		}))
		setErrors(prev => ({ ...prev, [name]: '' }))
	}

	const validate = () => {
		const newErrors: Record<string, string> = {}
		if (!formData.name || !formData.name.trim()) newErrors.name = 'Product name is required'
		if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0'
		if (!formData.category || !formData.category.trim()) newErrors.category = 'Category is required'
		return newErrors
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const validationErrors = validate()
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}

		const product: Product = {
			id: initialData?.id || Date.now(),
			name: formData.name || '',
			price: formData.price || 0,
			category: formData.category || '',
			status: formData.status || 'active',
			description: formData.description || '',
			image: formData.image || '',
			createdAt: initialData?.createdAt || new Date().toISOString(),
		}

		onSave(product)
		onClose()
	}

	return (
		<BaseModal title={initialData ? 'Edit Product' : 'Add New Product'} onClose={onClose}>
			<form onSubmit={handleSubmit} className='p-6 space-y-4'>
				{/* Product Name */}
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
						Product Name <span className='text-red-500'>*</span>
					</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						placeholder='e.g., Wireless Headphones'
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
						} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100`}
					/>
					{errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name}</p>}
				</div>

				<div className='grid grid-cols-2 gap-4'>
					{/* Price */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Price ($) <span className='text-red-500'>*</span>
						</label>
						<input
							type='number'
							name='price'
							value={formData.price || ''}
							onChange={handleChange}
							placeholder='Price'
							min={0}
							step={0.01}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.price ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
							} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100`}
						/>
						{errors.price && <p className='text-sm text-red-500 mt-1'>{errors.price}</p>}
					</div>

					{/* Category */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Category <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							name='category'
							value={formData.category}
							onChange={handleChange}
							placeholder='Electronics'
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.category ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
							} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100`}
						/>
						{errors.category && <p className='text-sm text-red-500 mt-1'>{errors.category}</p>}
					</div>
				</div>

				{/* Status */}
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
						Status <span className='text-red-500'>*</span>
					</label>
					<select
						name='status'
						value={formData.status}
						onChange={handleChange}
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
						placeholder='https://example.com/image.jpg'
						className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
						placeholder='Enter product description...'
						className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
					/>
				</div>

				{/* Actions */}
				<div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800'>
					<button
						type='button'
						onClick={onClose}
						className='px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium flex items-center gap-1'
					>
						<X className='w-4 h-4' /> Cancel
					</button>
					<button
						type='submit'
						className='px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 font-medium'
					>
						{initialData ? 'Update Product' : 'Add Product'}
					</button>
				</div>
			</form>
		</BaseModal>
	)
}
