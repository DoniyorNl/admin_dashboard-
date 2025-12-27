//app/products/page.tsx
import { Product } from '@/types/products'
import ProductsPageClient from './ProductsPageClient'
import { productsApi } from 'lib/api/products'

async function getProducts(): Promise<Product[]> {
	try {
		return await productsApi.getAll()
	} catch (err) {
		console.error('products: fetch error', err)
		return []
	}
}

export default async function ProductsPage() {
	const products = await getProducts()
	return <ProductsPageClient initialProducts={products} />
}
