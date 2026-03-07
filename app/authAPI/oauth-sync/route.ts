/**
 * OAuth ↔ Custom-auth ko'prigi
 *
 * Google/GitHub bilan kirish muvaffaqiyatli bo'lganda NextAuth foydalanuvchini
 * bu route'ga yo'naltiradi. Bu yerda:
 *  1. NextAuth JWT tokenidan email olinadi
 *  2. json-server'dan mos user topiladi
 *  3. Custom `auth_token` cookie o'rnatiladi (boshqa barcha sahifalar shunga tayanadi)
 *  4. /dashboard ga redirect qilinadi
 */
import { AUTH_API_BASE_URL } from 'lib/api/config'
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
		// 2. json-server'dan user qidirish
		const res = await fetch(`${AUTH_API_BASE_URL}/users?email=${encodeURIComponent(token.email)}`, {
			cache: 'no-store',
		})

		if (!res.ok) {
			console.error('[oauth-sync] Backend error:', res.status)
			return NextResponse.redirect(new URL('/login?error=OAuthBackendError', req.url))
		}

		const users: Array<{ id: number | string }> = await res.json()
		const user = users[0]

		if (!user) {
			// json-server'da yo'q — bu NextAuth signIn callback ichida yaratilishi kerak edi;
			// agar hali yaratilmagan bo'lsa qayta urinish uchun qaytaramiz
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
