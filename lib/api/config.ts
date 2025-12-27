// lib/api/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const EXTERNAL_APIS = {
	jsonPlaceholder: 'https://jsonplaceholder.typicode.com',
	fakeStore: 'https://fakestoreapi.com',
}

// Reusable fetch wrapper
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
	})

	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`)
	}

	return response.json()
}
