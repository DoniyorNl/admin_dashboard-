// lib/api/users.ts
import { User } from '@/types/users'
import { EXTERNAL_APIS, apiFetch } from './config'

export const usersApi = {
	// Get paginated users
	getAll: async (page: number = 1, limit: number = 5): Promise<User[]> => {
		return apiFetch<User[]>(
			`${EXTERNAL_APIS.jsonPlaceholder}/users?_limit=${limit}&_page=${page}`,
			{ cache: 'no-store' },
		)
	},

	// Get single user
	getById: async (id: number): Promise<User> => {
		return apiFetch<User>(`${EXTERNAL_APIS.jsonPlaceholder}/users/${id}`)
	},

	// Search users (client-side filter for JSONPlaceholder)
	search: async (query: string): Promise<User[]> => {
		const users = await apiFetch<User[]>(`${EXTERNAL_APIS.jsonPlaceholder}/users`)
		return users.filter(
			user =>
				user.name.toLowerCase().includes(query.toLowerCase()) ||
				user.email.toLowerCase().includes(query.toLowerCase()),
		)
	},
}
