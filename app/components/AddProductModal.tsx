'use client'
import { useState, FormEvent } from 'react'
import { Product } from '../types/products'
import Button from './Button'

type Props = {
	onAdd: (product: Product) => Promise<void>
	onClose: () => void
}

export default function AddProductModal({ onAdd, onClose }: Props) {
	const [name, setName] = useState('')
	const [price, setPrice] = useState<number>(0)
	const [category, setCategory] = useState('')
	const [status, setStatus] = useState<Product['status']>('active')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		await onAdd({ id: Date.now(), name, price, category, status })
		setLoading(false)
		onClose()
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50'>
			<div className='bg-white dark:bg-slate-900 rounded-lg p-6 w-96'>
				<h2 className='text-lg font-semibold mb-4'>Add Product</h2>
				<form className='space-y-3' onSubmit={handleSubmit}>
					<input
						className='border px-3 py-2 rounded w-full'
						placeholder='Name'
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
					<input
						type='number'
						className='border px-3 py-2 rounded w-full'
						placeholder='Price'
						value={price}
						onChange={e => setPrice(Number(e.target.value))}
						required
					/>
					<input
						className='border px-3 py-2 rounded w-full'
						placeholder='Category'
						value={category}
						onChange={e => setCategory(e.target.value)}
						required
					/>
					<select
						className='border px-3 py-2 rounded w-full'
						value={status}
						onChange={e => setStatus(e.target.value as Product['status'])}
					>
						<option value='active'>Active</option>
						<option value='inactive'>Inactive</option>
						<option value='draft'>Draft</option>
						<option value='out_of_stock'>Out of Stock</option>
					</select>
					<div className='flex justify-end gap-2 mt-4'>
						<Button type='button' variant='ghost' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' variant='primary' loading={loading}>
							Add
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
