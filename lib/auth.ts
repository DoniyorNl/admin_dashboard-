// src/lib/auth.ts
type AuthData = {
	username: string
	password: string
}

export async function login(data: AuthData) {
	await fetch('/api/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
}

export async function register(data: AuthData) {
	await fetch('/api/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
}

export async function logout() {
	await fetch('/api/logout', { method: 'POST' })
}
