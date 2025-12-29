import { AUTH_API_BASE_URL } from 'lib/api/config'
import { setAuthCookie } from 'lib/auth/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json()

		if (!email || !password || !name) {
			return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
		}

		const checkResponse = await fetch(
			`${AUTH_API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
			{
				cache: 'no-store',
			},
		)
		if (!checkResponse.ok) {
			const body = await checkResponse.text().catch(() => '')
			return NextResponse.json(
				{
					error: `Backend users lookup failed (HTTP ${checkResponse.status}). Is json-server running with a users collection?`,
					details: body || undefined,
				},
				{ status: 502 },
			)
		}

		let existingUsers: unknown = null
		try {
			existingUsers = await checkResponse.json()
		} catch {
			return NextResponse.json(
				{ error: 'Backend returned invalid JSON while checking existing users' },
				{ status: 502 },
			)
		}

		if (!Array.isArray(existingUsers)) {
			return NextResponse.json(
				{ error: 'Backend users lookup returned unexpected payload' },
				{ status: 502 },
			)
		}

		if (existingUsers.length > 0) {
			return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
		}

		const newUser = {
			email,
			password,
			name,
			role: 'user',
			twoFactorEnabled: false,
			twoFactorSecret: null,
		}

		const response = await fetch(`${AUTH_API_BASE_URL}/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newUser),
		})

		if (!response.ok) {
			const body = await response.text().catch(() => '')
			return NextResponse.json(
				{
					error: `Failed to create user (backend HTTP ${response.status})`,
					details: body || undefined,
				},
				{ status: 502 },
			)
		}

		const user = await response.json()
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
		console.error('Registration error:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'An error occurred during registration' },
			{ status: 500 },
		)
	}
}
