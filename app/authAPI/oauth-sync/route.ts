import { findUserByEmail } from 'lib/api/db'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
	// 1. NextAuth tomonidan qo'yilgan JWT ni o'qiymiz
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	})

	if (!token?.email) {
		console.error('[oauth-sync] No NextAuth token found')
		return NextResponse.redirect(new URL('/login?error=OAuthFailed', req.url))
	}

	try {
		// 2. db.json'dan user qidirish
		const user = findUserByEmail(token.email)

		// 3. Custom auth_token cookie o'rnatish
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax' as const,
			maxAge: 60 * 60 * 24 * 7, // 7 kun
			path: '/',
		}

		const redirectUrl = new URL('/dashboard', req.url)
		const response = NextResponse.redirect(redirectUrl)

		if (user) {
			// Normal case: user db.json da topildi
			response.cookies.set('auth_token', String(user.id), cookieOptions)
		} else {
			// Vercel: db.json read-only, yozish fayl darajasida fail bo'lgan.
			// Email-based token saqlaymiz — getCurrentUser() bu formatni anglaydi.
			console.log(
				'[oauth-sync] User not in db (Vercel read-only), using oauth token for:',
				token.email,
			)
			response.cookies.set('auth_token', `oauth:${token.email}`, cookieOptions)
		}

		return response
	} catch (err) {
		console.error('[oauth-sync] Unexpected error:', err)
		return NextResponse.redirect(new URL('/login?error=OAuthSyncError', req.url))
	}
}
