import { getCurrentUser } from 'lib/auth/auth'
import { NextResponse } from 'next/server'

/**
 * Ushbu route dinamik ma'lumot qaytaradi, shuning uchun Next.js uni keshlab qo'ymasligi kerak.
 * 'force-dynamic' cookies va headers ishlatilganda xavfsizlikni ta'minlaydi.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		// 1. Foydalanuvchini server-side cookie orqali olish
		const user = await getCurrentUser()

		// 2. Agar foydalanuvchi topilmasa (cookie yo'q yoki token eskirgan)
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					error: 'Unauthorized',
					message: 'Sessiya muddati tugagan yoki tizimga kirilmagan',
				},
				{ status: 401 },
			)
		}

		// 3. Muvaffaqiyatli javob
		// Biz foydalanuvchi ma'lumotlarini o'rab (wrapper) yuboramiz - bu API standartiga mos
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
		// 4. Xatolikni konsolga log qilish (faqat developmentda ko'rinsa yaxshi bo'ladi)
		console.error('[AUTH_ME_GET_ERROR]:', error)

		return NextResponse.json(
			{
				success: false,
				error: 'Internal Server Error',
				message: 'Serverda texnik xatolik yuz berdi',
			},
			{ status: 500 },
		)
	}
}
