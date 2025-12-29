import 'server-only'

import { AUTH_API_BASE_URL } from 'lib/api/config'
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

		// Backendga so'rov yuboramiz (userId ni encode qilgan holda)
		const response = await fetch(`${AUTH_API_BASE_URL}/users/${encodeURIComponent(userId)}`, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error(
				`[getCurrentUser] Failed to fetch user: ${response.status} ${response.statusText}`,
			)
			return null
		}

		const data = await response.json()

		// 🔄 ADAPTER: Backenddan kelgan har xil formatni yagona User interfacega o'tkazamiz
		return {
			id: data.id || data.user_id,
			email: data.email,
			name: data.name || data.full_name || 'No Name',
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
