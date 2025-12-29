import { AUTH_API_BASE_URL } from 'lib/api/config'
import { setAuthCookie } from 'lib/auth/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}))
		const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
		const password = typeof body.password === 'string' ? body.password : ''

		if (!email || !password) {
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
		}

		const response = await fetch(`${AUTH_API_BASE_URL}/users?email=${encodeURIComponent(email)}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			cache: 'no-store',
		})

		if (!response.ok) {
			const details = await response.text().catch(() => '')
			return NextResponse.json(
				{
					error: `Failed to connect to backend (HTTP ${response.status})`,
					details: details || undefined,
				},
				{ status: 502 },
			)
		}

		interface UserResponse {
			id: number
			email: string
			name: string
			password: string
			role?: string
			twoFactorEnabled?: boolean
		}

		let users: unknown = null
		try {
			users = await response.json()
		} catch {
			users = null
		}

		let user: UserResponse | undefined = undefined
		if (Array.isArray(users)) {
			user = users.find(
				(u: unknown): u is UserResponse =>
					typeof u === 'object' &&
					u !== null &&
					'email' in u &&
					String((u as UserResponse).email)
						.trim()
						.toLowerCase() === email,
			)
		}

		// Fallback: ba'zi holatlarda json-server filter ishlamasa
		if (!user) {
			const allRes = await fetch(`${AUTH_API_BASE_URL}/users`, { cache: 'no-store' })
			if (allRes.ok) {
				const all = await allRes.json().catch(() => [])
				if (Array.isArray(all)) {
					user = all.find(
						(u: unknown): u is UserResponse =>
							typeof u === 'object' &&
							u !== null &&
							'email' in u &&
							String((u as UserResponse).email)
								.trim()
								.toLowerCase() === email,
					)
				}
			}
		}

		const okPassword = user && String(user.password ?? '') === password

		if (!user || !okPassword) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
		}

		if (user.twoFactorEnabled) {
			return NextResponse.json({
				requiresTwoFactor: true,
				userId: user.id,
				message: 'Two-factor authentication required',
			})
		}

		// setAuthCookie lib/auth.ts dan keladi
		await setAuthCookie(user.id.toString())

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		})
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
	}
}
