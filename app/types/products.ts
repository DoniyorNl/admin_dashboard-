// types/products.ts
// 🔹 Product va Status tiplarini belgilaymiz
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock'

export type Product = {
	id: number
	name: string
	price: number
	category: string
	status: 'active' | 'inactive' | 'draft' | 'out_of_stock'
	description?: string
	image?: string
	createdAt?: string
}
