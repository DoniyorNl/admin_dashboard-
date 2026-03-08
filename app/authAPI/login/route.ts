import { findUserByEmail } from 'lib/api/db'
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

		const user = findUserByEmail(email)

		if (!user || String(user.password ?? '') !== password) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
		}

		if (user.twoFactorEnabled) {
			return NextResponse.json({
				requiresTwoFactor: true,
				userId: user.id,
				message: 'Two-factor authentication required',
			})
		}

		await setAuthCookie(String(user.id))

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
