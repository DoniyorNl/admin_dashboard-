const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4001'

export const EXTERNAL_APIS = {
	jsonPlaceholder: 'https://jsonplaceholder.typicode.com',
} as const

// ✅ Yangi response type
export interface ApiResponse<T> {
	success: boolean
	data: T | null
	error: string | null
	status: number
}

// ✅ Yangi apiFetch - error throw qilmaydi
export async function apiFetch<T = unknown>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	const url = endpoint.startsWith('http')
		? endpoint
		: endpoint.startsWith('/authAPI')
		? endpoint
		: `${API_BASE_URL}${endpoint}`

	const config: RequestInit = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	}

	try {
		const response = await fetch(url, config)

		const contentType = response.headers.get('content-type') || ''
		const isJson = contentType.includes('application/json')

		let payload: unknown = null
		if (response.status !== 204) {
			payload = isJson
				? await response.json().catch(() => null)
				: await response.text().catch(() => null)
		}

		if (!response.ok) {
			const message =
				(typeof payload === 'object' && payload !== null && 'message' in payload
					? (payload as any).message
					: typeof payload === 'object' && payload !== null && 'error' in payload
					? (payload as any).error
					: null) || `HTTP ${response.status}`

			// ❌ throw new Error(message) - OLIB TASHLADIK

			// ✅ Error object qaytaramiz
			return {
				success: false,
				data: null,
				error: message,
				status: response.status,
			}
		}

		// ✅ Success
		return {
			success: true,
			data: payload as T,
			error: null,
			status: response.status,
		}
	} catch (error) {
		// ✅ Network error
		return {
			success: false,
			data: null,
			error: error instanceof Error ? error.message : 'Network error',
			status: 0,
		}
	}
}

// ✅ Eski apiFetch (legacy support) - throw qiladi
export async function apiFetchLegacy<T = unknown>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const result = await apiFetch<T>(endpoint, options)

	if (!result.success) {
		throw new Error(result.error || 'Request failed')
	}

	return result.data as T
}

export { API_BASE_URL, AUTH_API_BASE_URL }
