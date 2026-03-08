import 'server-only'

import { findUserByEmail, getUserById } from 'lib/api/db'
import { cookies } from 'next/headers'

import type { User } from './types'

/**
 * Server-side: Foydalanuvchini cookie orqali aniqlash
 * Bu funksiya ham Route Handlerlarda, ham Server Componentlarda ishlaydi.
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('auth_token')?.value

		if (!token) {
			return null
		}

		// OAuth token (Vercel: db.json yozish imkonsiz bo'lganda)
		if (token.startsWith('oauth:')) {
			const email = token.slice(6)
			// Local devda db.json ga yozilgan bo'lishi mumkin
			const dbUser = findUserByEmail(email)
			if (dbUser) {
				return {
					id: Number(dbUser.id),
					email: dbUser.email,
					name: dbUser.name || email.split('@')[0],
					role: dbUser.role || 'user',
				}
			}
			// Vercel: virtual user (email dan keyin db ga qo'shilmagan)
			return {
				id: 0,
				email,
				name: email.split('@')[0],
				role: 'user',
			}
		}

		const data = getUserById(token)

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
