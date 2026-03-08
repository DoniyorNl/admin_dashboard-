import 'server-only'

import { getUserById } from 'lib/api/db'
import { cookies } from 'next/headers'

import type { User } from './types'

/**
 * Server-side: Foydalanuvchini cookie orqali aniqlash
 * Bu funksiya ham Route Handlerlarda, ham Server Componentlarda ishlaydi.
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const cookieStore = await cookies()
		const userId = cookieStore.get('auth_token')?.value

		if (!userId) {
			return null
		}

		const data = getUserById(userId)

		if (!data) {
			return null
		}

		return {
			id: Number(data.id),
			email: data.email,
			name: data.name || 'No Name',
			role: data.role || 'user',
		}
	} catch (error) {
		console.error('getCurrentUser Error:', error)
		return null
	}
}

/**
 * Cookie'ni o'rnatish (Login va Register uchun)
 */
export async function setAuthCookie(token: string) {
	const cookieStore = await cookies()
	cookieStore.set('auth_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7, // 1 hafta
		path: '/',
	})
}

/**
 * Cookie'ni o'chirish (Logout uchun)
 */
export async function clearAuthCookie() {
	const cookieStore = await cookies()
	cookieStore.delete('auth_token')
}
