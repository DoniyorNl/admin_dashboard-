import { getUserById, updateUser } from 'lib/api/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { userId, currentPassword, newPassword } = body

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

		const user = getUserById(userId)

		if (!user) {
			return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
		}

		if (user.password !== currentPassword) {
			return NextResponse.json(
				{ success: false, error: 'Current password is incorrect' },
				{ status: 401 },
			)
		}

		const updatedUser = updateUser(userId, { password: newPassword })

		return NextResponse.json({
			success: true,
			message: 'Password changed successfully',
			user: {
				id: updatedUser!.id,
				email: updatedUser!.email,
				name: updatedUser!.name,
				role: updatedUser!.role,
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
