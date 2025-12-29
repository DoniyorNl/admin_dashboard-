// lib/api/users.ts
import { User } from '@/types/users'
import { EXTERNAL_APIS, apiFetchLegacy } from './config'

// ============================================================================
// Private: Environment check
// ============================================================================
/**
 * Remote API ishlatish kerakligini tekshiradi.
 * Users uchun JSONPlaceholder ishlatamiz (external API).
 */
function shouldUseRemoteUsersApi(): boolean {
	// Agar env variable mavjud bo'lsa va local dev URL bo'lmasa - remote
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	return !!(apiUrl && apiUrl.trim() !== '' && apiUrl !== 'http://localhost:4000')
}

/**
 * Local mock users data (fallback uchun)
 * Real projectda bu backend/users.db.json dan o'qilishi mumkin
 */
function getMockUsers(): User[] {
	return [
		{
			id: 1,
			name: 'Admin User',
			email: 'admin@example.com',
			username: 'admin',
			phone: '+998 90 123 4567',
			website: 'admin.local',
		},
		{
			id: 2,
			name: 'John Doe',
			email: 'john@example.com',
			username: 'johndoe',
			phone: '+998 91 234 5678',
			website: 'john.local',
		},
		{
			id: 3,
			name: 'Jane Smith',
			email: 'jane@example.com',
			username: 'janesmith',
			phone: '+998 93 345 6789',
			website: 'jane.local',
		},
	] as User[]
}

// ============================================================================
// Public API: Environment-aware users adapter
// ============================================================================
export const usersApi = {
	// Get paginated users - remote (JSONPlaceholder) yoki local mock
	getAll: async (page: number = 1, limit: number = 5): Promise<User[]> => {
		if (shouldUseRemoteUsersApi()) {
			try {
				return await apiFetchLegacy<User[]>(
					`${EXTERNAL_APIS.jsonPlaceholder}/users?_limit=${limit}&_page=${page}`,
					{ cache: 'no-store' },
				)
			} catch (err) {
				console.warn('[Users API] Remote getAll failed, using mock data:', err)
				// Fallback to mock
			}
		}

		// Local mock data
		if (process.env.NODE_ENV === 'development') {
			console.log('[Users API] Using local mock data for getAll')
		}
		const mockUsers = getMockUsers()
		const startIdx = (page - 1) * limit
		return mockUsers.slice(startIdx, startIdx + limit)
	},

	// Get single user - remote yoki local mock
	getById: async (id: number): Promise<User> => {
		if (shouldUseRemoteUsersApi()) {
			try {
				return await apiFetchLegacy<User>(`${EXTERNAL_APIS.jsonPlaceholder}/users/${id}`)
			} catch (err) {
				console.warn(`[Users API] Remote getById(${id}) failed, using mock:`, err)
				// Fallback
			}
		}

		// Local mock
		const user = getMockUsers().find(u => u.id === id)
		if (!user) throw new Error(`User ${id} not found`)
		return user
	},

	// Search users - remote (client filter) yoki local mock filter
	search: async (query: string): Promise<User[]> => {
		if (shouldUseRemoteUsersApi()) {
			try {
				const users = await apiFetchLegacy<User[]>(`${EXTERNAL_APIS.jsonPlaceholder}/users`)
				return users.filter(
					user =>
						user.name.toLowerCase().includes(query.toLowerCase()) ||
						user.email.toLowerCase().includes(query.toLowerCase()),
				)
			} catch (err) {
				console.warn('[Users API] Remote search failed, using mock:', err)
				// Fallback
			}
		}

		// Local mock search
		const lowerQuery = query.toLowerCase()
		return getMockUsers().filter(
			user =>
				user.name.toLowerCase().includes(lowerQuery) ||
				user.email.toLowerCase().includes(lowerQuery),
		)
	},
}
