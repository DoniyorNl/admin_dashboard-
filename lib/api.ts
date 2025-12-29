// lib/api.ts

/**
 * safeFetchJson
 *
 * Xavfsiz fetch funksiyasi:
 * - Timeout qo'shadi
 * - Network xatolarini ushlaydi
 * - Non-ok response'larda null qaytaradi
 * - Never throws - har doim null yoki data qaytaradi
 *
 * @param endpoint - API endpoint (masalan: '/messages')
 * @param timeoutMs - Timeout milliseconds (default: 5000)
 * @returns Data yoki null
 */
export async function safeFetchJson<T = any>(
	endpoint: string,
	timeoutMs: number = 5000,
): Promise<T | null> {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
	const url = `${base.replace(/\/$/, '')}${endpoint}`

	try {
		// Timeout controller
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

		// Fetch with timeout
		const response = await fetch(url, {
			signal: controller.signal,
			cache: 'no-store', // Always fetch fresh data
			headers: {
				'Content-Type': 'application/json',
			},
		})

		clearTimeout(timeoutId)

		// Check response status
		if (!response.ok) {
			console.error(`[safeFetchJson] Non-OK response: ${response.status} for ${url}`)
			return null
		}

		// Parse JSON
		const data = await response.json()
		return data as T
	} catch (error) {
		// Handle all errors gracefully
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error(`[safeFetchJson] Timeout after ${timeoutMs}ms for ${url}`)
			} else {
				console.error(`[safeFetchJson] Fetch error for ${url}:`, error.message)
			}
		} else {
			console.error(`[safeFetchJson] Unknown error for ${url}:`, error)
		}

		return null
	}
}

/**
 * safeFetchJson with retry
 *
 * Xatolik bo'lsa, qayta urinadi
 *
 * @param endpoint - API endpoint
 * @param timeoutMs - Timeout milliseconds
 * @param retries - Qayta urinishlar soni (default: 2)
 * @returns Data yoki null
 */
export async function safeFetchJsonWithRetry<T = any>(
	endpoint: string,
	timeoutMs: number = 5000,
	retries: number = 2,
): Promise<T | null> {
	for (let i = 0; i <= retries; i++) {
		const result = await safeFetchJson<T>(endpoint, timeoutMs)

		if (result !== null) {
			return result
		}

		// Agar oxirgi retry bo'lmasa, kutib tur
		if (i < retries) {
			const delay = Math.min(1000 * Math.pow(2, i), 5000) // Exponential backoff
			if (process.env.NODE_ENV === 'development') {
				console.log(`[safeFetchJsonWithRetry] Retrying in ${delay}ms... (${i + 1}/${retries})`)
			}
			await new Promise(resolve => setTimeout(resolve, delay))
		}
	}

	return null
}

/**
 * POST request with safe error handling
 */
export async function safePostJson<T = any>(
	endpoint: string,
	body: any,
	timeoutMs: number = 5000,
): Promise<T | null> {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
	const url = `${base.replace(/\/$/, '')}${endpoint}`

	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

		const response = await fetch(url, {
			method: 'POST',
			signal: controller.signal,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			console.error(`[safePostJson] Non-OK response: ${response.status} for ${url}`)
			return null
		}

		const data = await response.json()
		return data as T
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error(`[safePostJson] Timeout after ${timeoutMs}ms for ${url}`)
			} else {
				console.error(`[safePostJson] Fetch error for ${url}:`, error.message)
			}
		}
		return null
	}
}
