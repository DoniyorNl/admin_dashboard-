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

// A safe fetch helper used by server pages that must not throw when the
// backend is unreachable. Returns parsed JSON on success, or `null` on
// timeout / network error / non-ok response. Uses a short timeout to
// avoid blocking server renders.
export async function safeFetchJson(path: string, timeoutMs = 3000): Promise<any | null> {
	const base = API_BASE_URL.replace(/\/$/, '')
	const url = `${base}${path.startsWith('/') ? path : `/${path}`}`

	const controller = new AbortController()
	const id = setTimeout(() => controller.abort(), timeoutMs)

	try {
		const res = await fetch(url, { signal: controller.signal, cache: 'no-store' })
		if (!res.ok) {
			console.error('safeFetchJson: non-ok', res.status, url)
			return null
		}
		return await res.json()
	} catch (err) {
		// Network error, timeout, DNS issues, etc. — return null so callers
		// can render a graceful fallback instead of crashing the page.
		console.warn('safeFetchJson error', url, err)
		return null
	} finally {
		clearTimeout(id)
	}
}
