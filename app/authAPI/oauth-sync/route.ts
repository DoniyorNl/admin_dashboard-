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

		if (!user) {
			console.error('[oauth-sync] User not found in db for email:', token.email)
			return NextResponse.redirect(new URL('/login?error=OAuthUserNotFound', req.url))
		}

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

		response.cookies.set('auth_token', String(user.id), cookieOptions)

		return response
	} catch (err) {
		console.error('[oauth-sync] Unexpected error:', err)
		return NextResponse.redirect(new URL('/login?error=OAuthSyncError', req.url))
	}
}
