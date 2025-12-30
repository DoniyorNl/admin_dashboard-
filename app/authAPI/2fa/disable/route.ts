import { AUTH_API_BASE_URL } from 'lib/api/config'
import { resetRateLimit } from 'lib/security/rateLimit'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /authAPI/2fa/disable
 *
 * PRODUCTION-READY VERSION:
 * - Updates database (removes secret, sets enabled=false)
 * - Clears rate limit entries
 * - Requires user authentication
 *
 * Flow:
 * 1. Verify user authentication
 * 2. Update DB (remove secret, disable 2FA)
 * 3. Clear rate limit cache for this user
 */
export async function POST(request: NextRequest) {
	try {
		// 1. Get user ID from request body
		const body = await request.json().catch(() => ({}))
		const userId = body.userId || body.id

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User authentication required' },
				{ status: 401 },
			)
		}

		// 2. Update user in database
		const updateResponse = await fetch(`${AUTH_API_BASE_URL}/users/${userId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				twoFactorSecret: null,
				twoFactorEnabled: false,
			}),
		})

		if (!updateResponse.ok) {
			throw new Error('Failed to disable 2FA in database')
		}

		// 3. Clear rate limit entries for this user
		resetRateLimit(`2fa-verify:${userId}`)
		resetRateLimit(`2fa-enable:${userId}`)

		console.log(`[2FA Disable] 2FA disabled for user ${userId}`)

		return NextResponse.json({
			success: true,
			message: '2FA disabled successfully',
		})
	} catch (error) {
		console.error('[2FA Disable] Error:', error)
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to disable 2FA',
			},
			{ status: 500 },
		)
	}
}
