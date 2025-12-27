// src/lib/auth.ts
type AuthData = {
	username: string
	password: string
}

export async function login(data: AuthData) {
	// Perform login request to server route. Server now returns `{ success, token }`.
	const res = await fetch('/authAPI/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})

	if (!res.ok) {
		throw new Error('Login failed')
	}

	// Read token from JSON response and persist to localStorage so client-side `Protected` can detect auth.
	const json = await res.json()
	if (json?.token) {
		// NOTE: server also sets an httpOnly cookie; localStorage is kept in sync for client checks.
		localStorage.setItem('token', json.token)
		if (json.username) localStorage.setItem('username', json.username)
	}
}

export async function register(data: AuthData) {
	const res = await fetch('/authAPI/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})

	if (!res.ok) {
		throw new Error('Registration failed')
	}

	const json = await res.json()
	if (json?.token) {
		// Persist token same as login flow
		localStorage.setItem('token', json.token)
		if (json.username) localStorage.setItem('username', json.username)
	}
}

export async function logout() {
	// Clear localStorage token copy and notify server to clear httpOnly cookie
	try {
		await fetch('/authAPI/logout', { method: 'POST' })
	} finally {
		localStorage.removeItem('token')
		localStorage.removeItem('username')
	}
}
