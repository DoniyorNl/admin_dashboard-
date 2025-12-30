import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { userId, currentPassword, newPassword } = body

		// Validate input
		if (!userId || !currentPassword || !newPassword) {
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		if (newPassword.length < 8) {
			return NextResponse.json(
				{ success: false, error: 'New password must be at least 8 characters' },
				{ status: 400 },
			)
		}

		// Fetch user from database
		const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`)

		if (!userResponse.ok) {
			return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
		}

		const user = await userResponse.json()

		// Verify current password
		if (user.password !== currentPassword) {
			return NextResponse.json(
				{ success: false, error: 'Current password is incorrect' },
				{ status: 401 },
			)
		}

		// Update password in database
		const updateResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
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

		const updatedUser = await updateResponse.json()

		// Update localStorage user data if password changed successfully
		return NextResponse.json({
			success: true,
			message: 'Password changed successfully',
			user: {
				id: updatedUser.id,
				email: updatedUser.email,
				name: updatedUser.name,
				role: updatedUser.role,
			},
		})
	} catch (error) {
		console.error('Password change error:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to change password' },
			{ status: 500 },
		)
	}
}
