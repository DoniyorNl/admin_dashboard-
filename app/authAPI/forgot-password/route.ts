import { sendPasswordResetEmail } from 'lib/email/mailer'
import { validateEmailComprehensive } from 'lib/email/validator'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Random parol generatori
function generateRandomPassword(length: number = 12): string {
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const lowercase = 'abcdefghijklmnopqrstuvwxyz'
	const numbers = '0123456789'
	const symbols = '!@#$%^&*'

	const allChars = uppercase + lowercase + numbers + symbols
	let password = ''

	// Kamida bittadan har xil belgi bo'lishi uchun
	password += uppercase[Math.floor(Math.random() * uppercase.length)]
	password += lowercase[Math.floor(Math.random() * lowercase.length)]
	password += numbers[Math.floor(Math.random() * numbers.length)]
	password += symbols[Math.floor(Math.random() * symbols.length)]

	// Qolgan belgilar
	for (let i = password.length; i < length; i++) {
		password += allChars[Math.floor(Math.random() * allChars.length)]
	}

	// Belgilarni aralashtirish
	return password
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('')
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { email } = body

		// Email validatsiyasi
		if (!email) {
			return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
		}

		// Email formatini tekshirish
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
		}

		// To'liq email validation (MX + API)
		const emailValidation = await validateEmailComprehensive(email)
		if (!emailValidation.isValid) {
			return NextResponse.json({ success: false, error: emailValidation.reason }, { status: 400 })
		}

		// Barcha foydalanuvchilarni olish
		const usersResponse = await fetch(`${API_BASE_URL}/users`)

		if (!usersResponse.ok) {
			throw new Error('Failed to fetch users')
		}

		const users = await usersResponse.json()

		// Email bo'yicha foydalanuvchini topish
		const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'No account found with this email address' },
				{ status: 404 },
			)
		}

		// Yangi random parol generatsiya qilish
		const newPassword = generateRandomPassword(12)

		// Parolni database'da yangilash
		const updateResponse = await fetch(`${API_BASE_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password: newPassword,
			}),
		})

		if (!updateResponse.ok) {
			throw new Error('Failed to update password')
		}

		// Email yuborish
		const emailSent = await sendPasswordResetEmail(user.email, user.name, newPassword)

		if (!emailSent) {
			console.warn('Email sending failed, but password was updated in database')
			// Email yuborilmasa ham, parol database'da yangilangan
		}

		// Muvaffaqiyatli javob
		return NextResponse.json({
			success: true,
			message: 'Password reset email sent successfully',
			email: user.email,
			// Production'da parolni QAYTARMASLIK kerak!
			// Faqat email yuborilganligini bildirish
		})
	} catch (error) {
		console.error('Forgot password error:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to process password reset request' },
			{ status: 500 },
		)
	}
}
