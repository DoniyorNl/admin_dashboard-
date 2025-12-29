import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /authAPI/2fa/disable
 *
 * Vazifasi:
 * 1. User'ning 2FA'sini o'chiradi
 * 2. Cookie'dan secret'ni o'chiradi
 *
 * Flow:
 * User "Disable 2FA" toggle'ni bosadi
 *   → Frontend bu endpoint'ga POST qiladi
 *   → Backend secret'ni cookie/DB'dan o'chiradi
 */
export async function POST(_request: NextRequest) {
	try {
		const cookieStore = await cookies()

		// Cookie'dan secret o'chirish
		cookieStore.delete('2fa_secret')

		// Production'da DB'dan ham o'chirish kerak:
		// await db.users.update({
		//   where: { id: userId },
		//   data: { twoFactorSecret: null, twoFactorEnabled: false }
		// })

		return NextResponse.json({
			success: true,
			message: '2FA disabled successfully',
		})
	} catch (error) {
		console.error('[2FA Disable] Error:', error)
		return NextResponse.json({ success: false, error: 'Failed to disable 2FA' }, { status: 500 })
	}
}
