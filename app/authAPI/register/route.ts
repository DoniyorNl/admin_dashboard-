import { createUser, findUserByEmail } from 'lib/api/db'
import { setAuthCookie } from 'lib/auth/auth'
import { validateEmailComprehensive } from 'lib/email/validator'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json()

		if (!email || !password || !name) {
			return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
		}

		// Email validation (MX + API) - Real email tekshiruvi
		console.log('🔍 Validating email for registration:', email)

		let emailValidation
		try {
			emailValidation = await validateEmailComprehensive(email)
			console.log('📊 Validation result:', emailValidation)
		} catch (validationError) {
			console.error('💥 VALIDATION ERROR:', validationError)
			return NextResponse.json(
				{ error: 'Email validation service error. Please try again.' },
				{ status: 500 },
			)
		}

		if (!emailValidation.isValid) {
			console.log('❌ Email validation failed:', emailValidation.reason)
			return NextResponse.json(
				{ error: `Invalid email: ${emailValidation.reason}` },
				{ status: 400 },
			)
		}

		console.log('✅ Email validation passed:', email)

		const existing = findUserByEmail(email)
		if (existing) {
			return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
		}

		const user = createUser({
			email,
			password,
			name,
			role: 'user',
			twoFactorEnabled: false,
			twoFactorSecret: null,
		})

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
		console.error('Registration error:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'An error occurred during registration' },
			{ status: 500 },
		)
	}
}
