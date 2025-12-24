// File: app/(dashboard)/dashboard/products/page.tsx
// Server Component: initialProducts fetch qilinadi va client component-ga uzatiladi
import { Product } from '@/types/products'
import ProductsPageClient from './ProductsPageClient'

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:4000/products', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsPageClient initialProducts={products} />
}
