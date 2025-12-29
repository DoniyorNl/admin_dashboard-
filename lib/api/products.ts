// lib/api/products.ts
import { Product } from '@/types/products'
import fs from 'fs'
import path from 'path'
import { API_BASE_URL, apiFetch } from './config'

// ============================================================================
// Private: local fallback - backend/product.db.json dan o'qish
// ============================================================================
/**
 * Local JSON fayl (backend/product.db.json) dan productlarni o'qiydi.
 * Bu funksiya faqat server-side ishlatiladi.
 */
function getProductsFromLocalFile(): Product[] {
	try {
		const filePath = path.join(process.cwd(), 'backend', 'product.db.json')
		const raw = fs.readFileSync(filePath, 'utf-8')
		const db = JSON.parse(raw)
		return db.products || []
	} catch (err) {
		console.warn('[Products Adapter] Local file read error:', err)
		return []
	}
}

/**
 * Local fayldan bitta product topish (ID bo'yicha)
 */
function getProductByIdFromLocalFile(id: number): Product | null {
	const products = getProductsFromLocalFile()
	return products.find(p => p.id === id) || null
}

// ============================================================================
// Private: environment check - remote API ishlatish kerakmi?
// ============================================================================
/**
 * NEXT_PUBLIC_API_URL o'rnatilganligini tekshiradi.
 * Agar o'rnatilgan bo'lsa, remote API ishlatiladi.
 */
function shouldUseRemoteApi(): boolean {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	return !!(apiUrl && apiUrl.trim() !== '' && apiUrl !== 'http://localhost:4000')
}

// ============================================================================
// Public API: Environment-aware products adapter
// ============================================================================
export const productsApi = {
	// ✅ Get all products - yangi apiFetch bilan
	getAll: async (): Promise<Product[]> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product[]>(`${API_BASE_URL}/products`, {
				cache: 'no-store',
			})

			if (!result.success) {
				console.warn('[Products API] Remote getAll failed, using local fallback:', result.error)
				return getProductsFromLocalFile()
			}

			return result.data || []
		}

		// Local fallback (development mode)
		console.log('[Products API] Using local file for getAll')
		return getProductsFromLocalFile()
	},

	// ✅ Get single product - yangi apiFetch bilan
	getById: async (id: number): Promise<Product> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product>(`${API_BASE_URL}/products/${id}`)

			if (!result.success) {
				console.warn(
					`[Products API] Remote getById(${id}) failed, using local fallback:`,
					result.error,
				)
				const product = getProductByIdFromLocalFile(id)
				if (!product) throw new Error(`Product ${id} not found`)
				return product
			}

			if (!result.data) {
				throw new Error(`Product ${id} not found`)
			}

			return result.data
		}

		// Local fallback
		const product = getProductByIdFromLocalFile(id)
		if (!product) throw new Error(`Product ${id} not found in local data`)
		return product
	},

	// ✅ Create product - yangi apiFetch bilan
	create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product>(`${API_BASE_URL}/products`, {
				method: 'POST',
				body: JSON.stringify(product),
			})

			if (!result.success) {
				throw new Error(result.error || 'Failed to create product')
			}

			if (!result.data) {
				throw new Error('No data returned from create')
			}

			return result.data
		}

		// Local fallback: mock response (real write qilinmaydi)
		console.warn('[Products API] Create called in local mode - returning mock')
		return {
			...product,
			id: Date.now(), // Mock ID
			createdAt: new Date().toISOString(),
		} as Product
	},

	// ✅ Update product - yangi apiFetch bilan
	update: async (id: number, product: Partial<Product>): Promise<Product> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product>(`${API_BASE_URL}/products/${id}`, {
				method: 'PUT',
				body: JSON.stringify(product),
			})

			if (!result.success) {
				throw new Error(result.error || 'Failed to update product')
			}

			if (!result.data) {
				throw new Error('No data returned from update')
			}

			return result.data
		}

		// Local fallback: mock success
		console.warn('[Products API] Update called in local mode - returning mock')
		const existing = getProductByIdFromLocalFile(id)
		if (!existing) throw new Error(`Product ${id} not found`)
		return { ...existing, ...product } as Product
	},

	// ✅ Delete product - yangi apiFetch bilan
	delete: async (id: number): Promise<void> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<void>(`${API_BASE_URL}/products/${id}`, {
				method: 'DELETE',
			})

			if (!result.success) {
				throw new Error(result.error || 'Failed to delete product')
			}

			return
		}

		// Local fallback: mock success (haqiqatda o'chirilmaydi)
		console.warn('[Products API] Delete called in local mode - mock success')
	},

	// ✅ Search products - yangi apiFetch bilan
	search: async (query: string): Promise<Product[]> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product[]>(
				`${API_BASE_URL}/products?q=${encodeURIComponent(query)}`,
			)

			if (!result.success) {
				console.warn('[Products API] Remote search failed, using local filter:', result.error)
				// Fallback to local filter
			} else {
				return result.data || []
			}
		}

		// Local search: client-side filter
		const products = getProductsFromLocalFile()
		const lowerQuery = query.toLowerCase()
		return products.filter(
			p =>
				p.name?.toLowerCase().includes(lowerQuery) ||
				p.category?.toLowerCase().includes(lowerQuery) ||
				p.description?.toLowerCase().includes(lowerQuery),
		)
	},

	// ✅ Filter by category - yangi apiFetch bilan
	getByCategory: async (category: string): Promise<Product[]> => {
		if (shouldUseRemoteApi()) {
			const result = await apiFetch<Product[]>(
				`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`,
			)

			if (!result.success) {
				console.warn(
					'[Products API] Remote getByCategory failed, using local filter:',
					result.error,
				)
				// Fallback to local
			} else {
				return result.data || []
			}
		}

		// Local filter
		const products = getProductsFromLocalFile()
		return products.filter(p => p.category === category)
	},

	// ✅ Paginated list - yangi apiFetch bilan
	getPaginated: async (
		params: { page?: number; limit?: number; search?: string; status?: string } = {},
	) => {
		const { page = 1, limit = 10, search = '', status = '' } = params

		if (shouldUseRemoteApi()) {
			try {
				const query = new URLSearchParams()
				query.append('_page', page.toString())
				query.append('_limit', limit.toString())
				if (search) query.append('q', search)
				if (status) query.append('status', status)

				const url = `${API_BASE_URL}/products?${query.toString()}`

				// getPaginated uchun maxsus fetch - header kerak
				const response = await fetch(url, {
					cache: 'no-store',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				if (!response.ok) {
					throw new Error(`API Error: ${response.status} ${response.statusText}`)
				}

				const data = await response.json()
				const totalCount = response.headers.get('X-Total-Count')

				return {
					products: data as Product[],
					total: totalCount ? Number(totalCount) : 0,
				}
			} catch (err) {
				console.warn('[Products API] Remote getPaginated failed, using local slice:', err)
				// Fallback to local
			}
		}

		// Local fallback: manual pagination
		let products = getProductsFromLocalFile()

		// Filter by search
		if (search) {
			const lowerQuery = search.toLowerCase()
			products = products.filter(
				p =>
					p.name?.toLowerCase().includes(lowerQuery) ||
					p.category?.toLowerCase().includes(lowerQuery),
			)
		}

		// Filter by status
		if (status) {
			products = products.filter(p => p.status === status)
		}

		const total = products.length
		const startIdx = (page - 1) * limit
		const paginatedProducts = products.slice(startIdx, startIdx + limit)

		return {
			products: paginatedProducts,
			total,
		}
	},
}
