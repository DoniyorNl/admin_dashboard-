import crypto from 'crypto'
import { AUTH_API_BASE_URL } from 'lib/api/config'
import { setAuthCookie } from 'lib/auth/auth'
import { decrypt } from 'lib/security/encryption'
import { checkRateLimit, RATE_LIMITS, resetRateLimit } from 'lib/security/rateLimit'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function base32ToBuffer(base32: string) {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
	const cleaned = base32
		.toUpperCase()
		.replace(/=+$/g, '')
		.replace(/[^A-Z2-7]/g, '')
	let bits = ''
	for (const c of cleaned) {
		const val = alphabet.indexOf(c)
		if (val === -1) continue
		bits += val.toString(2).padStart(5, '0')
	}
	const bytes: number[] = []
	for (let i = 0; i + 8 <= bits.length; i += 8) {
		bytes.push(parseInt(bits.slice(i, i + 8), 2))
	}
	return Buffer.from(bytes)
}

function hotp(secret: Buffer, counter: number, digits = 6) {
	const buf = Buffer.alloc(8)
	buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
	buf.writeUInt32BE(counter % 0x100000000, 4)

	const hmac = crypto.createHmac('sha1', secret).update(buf).digest()
	const offset = hmac[hmac.length - 1] & 0x0f
	const code =
		((hmac[offset] & 0x7f) << 24) |
		((hmac[offset + 1] & 0xff) << 16) |
		((hmac[offset + 2] & 0xff) << 8) |
		(hmac[offset + 3] & 0xff)

	const otp = (code % 10 ** digits).toString().padStart(digits, '0')
	return otp
}

function verifyTotp(base32Secret: string, token: string, window = 1) {
	if (!/^\d{6}$/.test(token)) return false
	const secret = base32ToBuffer(base32Secret)
	const step = 30
	const now = Math.floor(Date.now() / 1000)
	const counter = Math.floor(now / step)

	for (let w = -window; w <= window; w++) {
		if (hotp(secret, counter + w, 6) === token) return true
	}
	return false
}

/**
 * POST /authAPI/2fa/verify
 *
 * PRODUCTION-READY VERSION:
 * - Rate limiting (5 attempts per 15 min, then 30 min block)
 * - Decrypts secret from database
 * - Enables 2FA after successful verification
 * - Resets rate limit on success
 */
export async function POST(request: Request) {
	try {
		const { userId, code } = await request.json()

		if (!userId || !code) {
			return NextResponse.json({ error: 'User ID and code are required' }, { status: 400 })
		}

		// 1. Rate limiting (prevent brute force)
		const rateLimitKey = `2fa-verify:${userId}`
		const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.TFA_VERIFY)

		if (!rateLimit.allowed) {
			console.warn(`[2FA Verify] Rate limit exceeded for user ${userId}`)
			return NextResponse.json(
				{
					error: `Too many failed attempts. Try again in ${Math.ceil(
						(rateLimit.retryAfter || 0) / 60,
					)} minutes`,
					retryAfter: rateLimit.retryAfter,
				},
				{ status: 429 },
			)
		}

		// 2. Get user from database
		const userRes = await fetch(`${AUTH_API_BASE_URL}/users/${userId}`, { cache: 'no-store' })
		if (!userRes.ok) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const user = await userRes.json()

		if (!user.twoFactorSecret) {
			return NextResponse.json({ error: 'Two-factor auth not set up' }, { status: 400 })
		}

		// 3. Decrypt secret
		let decryptedSecret: string
		try {
			decryptedSecret = decrypt(user.twoFactorSecret)
		} catch (error) {
			console.error('[2FA Verify] Decryption failed:', error)
			return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
		}

		// 4. Verify TOTP code
		const isValid = verifyTotp(decryptedSecret, String(code), 1)

		if (!isValid) {
			console.warn(`[2FA Verify] Invalid code attempt for user ${userId}`)
			return NextResponse.json(
				{
					error: 'Invalid verification code',
					remaining: rateLimit.remaining,
				},
				{ status: 401 },
			)
		}

		// 5. Success: Enable 2FA if not already enabled
		if (!user.twoFactorEnabled) {
			await fetch(`${AUTH_API_BASE_URL}/users/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ twoFactorEnabled: true }),
			})
		}

		// 6. Reset rate limits (successful verification)
		resetRateLimit(rateLimitKey)

		// 7. Set auth cookie
		await setAuthCookie(String(user.id))

		console.log(`[2FA Verify] Success for user ${userId}`)

		return NextResponse.json({
			success: true,
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
		})
	} catch (error) {
		console.error('[2FA Verify] Error:', error)
		return NextResponse.json({ error: 'An error occurred during verification' }, { status: 500 })
	}
}
