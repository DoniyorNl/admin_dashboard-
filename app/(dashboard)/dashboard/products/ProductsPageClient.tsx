// dashboard/products/ProductsPageClient.tsx
'use client'

import AddProductModal from '@/components/features/products/AddProductModal'
import Badge from '@/components/UI/Badge'
import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { Product, ProductStatus } from '@/types/products'
import { AlertCircle, Download, Package, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'

type Props = {
	initialProducts: Product[]
}

const statusColorMap: Record<ProductStatus, 'blue' | 'green' | 'red' | 'gray'> = {
	active: 'green',
	inactive: 'red',
	draft: 'gray',
	out_of_stock: 'red',
}

export default function ProductsPageClient({ initialProducts }: Props) {
	const [products, setProducts] = useState<Product[]>(initialProducts)
	const [modalOpen, setModalOpen] = useState(false)
	const [editProduct, setEditProduct] = useState<Product | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all')

	// Filter va search
	const filteredProducts = products.filter(product => {
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.category.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesStatus = filterStatus === 'all' || product.status === filterStatus
		return matchesSearch && matchesStatus
	})

	// Statistics
	const stats = {
		total: products.length,
		active: products.filter(p => p.status === 'active').length,
		outOfStock: products.filter(p => p.status === 'out_of_stock').length,
		totalValue: products.reduce((sum, p) => sum + p.price, 0),
	}

	const handleAddEdit = (product: Product) => {
		setProducts(prev =>
			prev.some(p => p.id === product.id)
				? prev.map(p => (p.id === product.id ? product : p))
				: [...prev, product],
		)
		setModalOpen(false)
		setEditProduct(null)
	}

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this product?')) {
			setProducts(prev => prev.filter(p => p.id !== id))
		}
	}

	const handleEdit = (product: Product) => {
		setEditProduct(product)
		setModalOpen(true)
	}

	const handleAddNew = () => {
		setEditProduct(null)
		setModalOpen(true)
	}

	return (
		<div className='space-y-6'>
			{/* Header Section */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>Products</h1>
					<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
						Manage your product inventory and pricing
					</p>
				</div>
				<Button variant='primary' onClick={handleAddNew}>
					+ Add Product
				</Button>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Total Products</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								{stats.total}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
							<Package className='w-6 h-6 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Active</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								{stats.active}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
							<TrendingUp className='w-6 h-6 text-green-600 dark:text-green-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Out of Stock</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								{stats.outOfStock}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center'>
							<AlertCircle className='w-6 h-6 text-red-600 dark:text-red-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>Total Value</p>
							<p className='text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
								${stats.totalValue.toFixed(2)}
							</p>
						</div>
						<div className='w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center'>
							<TrendingUp className='w-6 h-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='flex-1 relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
						<Input
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder='Search products by name or category...'
							icon={<Search className='w-5 h-5 text-slate-400' />}
						/>
					</div>
					<div className='flex gap-2'>
						<select
							value={filterStatus}
							onChange={e => setFilterStatus(e.target.value as ProductStatus | 'all')}
							className='px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='all'>All Status</option>
							<option value='active'>Active</option>
							<option value='inactive'>Inactive</option>
							<option value='draft'>Draft</option>
							<option value='out_of_stock'>Out of Stock</option>
						</select>
						<Button>
							<Download className='w-4 h-4' />
							<span className='hidden sm:inline'>Export</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Products Table */}
			<div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden'>
				{filteredProducts.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16 px-4'>
						<div className='w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4'>
							<Package className='w-8 h-8 text-slate-400' />
						</div>
						<p className='text-slate-600 dark:text-slate-400 font-medium mb-2'>No products found</p>
						<p className='text-sm text-slate-500 dark:text-slate-500'>
							{searchQuery || filterStatus !== 'all'
								? 'Try adjusting your search or filters'
								: 'Add your first product to get started'}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
								<tr>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Product
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Category
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Price
									</th>
									<th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Status
									</th>
									<th className='px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
								{filteredProducts.map(product => (
									<tr
										key={product.id}
										className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
									>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-3'>
												{product.image ? (
													<img
														src={product.image}
														alt={product.name}
														className='w-10 h-10 rounded-lg object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
														<Package className='w-5 h-5 text-slate-400' />
													</div>
												)}
												<div>
													<p className='font-medium text-slate-800 dark:text-slate-100'>
														{product.name}
													</p>
													<p className='text-sm text-slate-500 dark:text-slate-400'>
														ID: {product.id}
													</p>
												</div>
											</div>
										</td>
										<td className='px-6 py-4'>
											<span className='text-sm text-slate-600 dark:text-slate-400'>
												{product.category}
											</span>
										</td>
										<td className='px-6 py-4'>
											<span className='font-semibold text-slate-800 dark:text-slate-100'>
												${product.price.toFixed(2)}
											</span>
										</td>
										<td className='px-6 py-4'>
											<Badge color={statusColorMap[product.status]}>
												{product.status.replace('_', ' ')}
											</Badge>
										</td>
										<td className='px-6 py-4'>
											<div className='flex items-center justify-end gap-2'>
												<Button variant='ghost' size='sm' onClick={() => handleEdit(product)}>
													Edit
												</Button>
												<Button variant='danger' size='sm' onClick={() => handleDelete(product.id)}>
													Delete
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal */}
			{modalOpen && (
				<AddProductModal
					initialData={editProduct}
					onClose={() => {
						setModalOpen(false)
						setEditProduct(null)
					}}
					onSave={handleAddEdit}
				/>
			)}
		</div>
	)
}
