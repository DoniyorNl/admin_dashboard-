const BASE_URL = 'http://localhost:4000/products'

export type Product = {
	id: number
	name: string
	description: string
	price: number
	category: string
	image: string
	status: 'active' | 'draft' | 'out_of_stock'
	createdAt: string
}

type GetProductsParams = {
	page?: number
	limit?: number
	search?: string
	status?: string
}

export async function getProducts(params: GetProductsParams = {}) {
	const { page = 1, limit = 10, search = '', status = '' } = params

	const query = new URLSearchParams()

	query.append('_page', page.toString())
	query.append('_limit', limit.toString())

	if (search) query.append('q', search)
	if (status) query.append('status', status)

	const res = await fetch(`${BASE_URL}?${query.toString()}`, {
		cache: 'no-store',
	})

	if (!res.ok) {
		throw new Error('Failed to fetch products')
	}

	const data = await res.json()

	const totalCount = res.headers.get('X-Total-Count')

	return {
		products: data as Product[],
		total: totalCount ? Number(totalCount) : 0,
	}
}
