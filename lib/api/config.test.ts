import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from './config'

describe('apiFetch', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns success payload for 200 JSON response', async () => {
		const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		)

		const result = await apiFetch<{ ok: boolean }>('/products')

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(result.success).toBe(true)
		expect(result.status).toBe(200)
		expect(result.data).toEqual({ ok: true })
		expect(result.error).toBeNull()
	})

	it('returns normalized error payload for non-2xx responses', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Invalid request' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}),
		)

		const result = await apiFetch('/products')

		expect(result.success).toBe(false)
		expect(result.status).toBe(400)
		expect(result.data).toBeNull()
		expect(result.error).toBe('Invalid request')
	})
})
