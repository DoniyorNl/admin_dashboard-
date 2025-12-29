import type { User } from './types'

export function clearClientAuth() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('user')
	}
}

export function getClientUser(): User | null {
	if (typeof window === 'undefined') return null

	try {
		const userStr = localStorage.getItem('user')
		if (!userStr) return null

		const user = JSON.parse(userStr) as User

		if (user.id && user.email && user.name) {
			return user
		}

		return null
	} catch {
		localStorage.removeItem('user')
		return null
	}
}

export function setClientUser(user: User) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('user', JSON.stringify(user))
	}
}

/**
 * Client-side logout helper
 * Clears both server cookie and localStorage
 */
export async function logoutUser() {
	try {
		// Clear server-side cookie
		await fetch('/authAPI/logout', {
			method: 'POST',
			credentials: 'include',
		})
	} catch (error) {
		console.error('Server logout failed:', error)
	} finally {
		// Always clear client state (fallback pattern)
		if (typeof window !== 'undefined') {
			localStorage.removeItem('user')
			window.location.href = '/login'
		}
	}
}
