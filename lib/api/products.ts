// lib/api/products.ts
import { Product } from '@/types/products'
import { API_BASE_URL, apiFetch } from './config'

export const productsApi = {
	// Get all products
	getAll: async (): Promise<Product[]> => {
		return apiFetch<Product[]>(`${API_BASE_URL}/products`, {
			cache: 'no-store',
		})
	},

	// Get single product
	getById: async (id: number): Promise<Product> => {
		return apiFetch<Product>(`${API_BASE_URL}/products/${id}`)
	},

	// Create product
	create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
		return apiFetch<Product>(`${API_BASE_URL}/products`, {
			method: 'POST',
			body: JSON.stringify(product),
		})
	},

	// Update product
	update: async (id: number, product: Partial<Product>): Promise<Product> => {
		return apiFetch<Product>(`${API_BASE_URL}/products/${id}`, {
			method: 'PUT',
			body: JSON.stringify(product),
		})
	},

	// Delete product
	delete: async (id: number): Promise<void> => {
		await apiFetch(`${API_BASE_URL}/products/${id}`, {
			method: 'DELETE',
		})
	},

	// Search products
	search: async (query: string): Promise<Product[]> => {
		return apiFetch<Product[]>(`${API_BASE_URL}/products?q=${encodeURIComponent(query)}`)
	},

	// Filter by category
	getByCategory: async (category: string): Promise<Product[]> => {
		return apiFetch<Product[]>(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`)
	},

	// Paginated list (returns items + total count)
	// Eslatma: `apiFetch` faqat JSON ni qaytaradi va response headerlarini ko'rishga imkon bermaydi.
	// Shu sababli, sahifalash (X-Total-Count) uchun quyidagi metod `fetch` dan bevosita foydalanadi.
	getPaginated: async (
		params: { page?: number; limit?: number; search?: string; status?: string } = {},
	) => {
		const { page = 1, limit = 10, search = '', status = '' } = params
		const query = new URLSearchParams()

		query.append('_page', page.toString())
		query.append('_limit', limit.toString())

		if (search) query.append('q', search)
		if (status) query.append('status', status)

		// `no-store` so that we always get fresh headers from json-server
		const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, { cache: 'no-store' })

		if (!res.ok) {
			throw new Error(`API Error: ${res.status} ${res.statusText}`)
		}

		const data = await res.json()
		const totalCount = res.headers.get('X-Total-Count')

		return {
			products: data as Product[],
			total: totalCount ? Number(totalCount) : 0,
		}
	},
}
