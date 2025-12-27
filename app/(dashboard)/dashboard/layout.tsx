// Server-side layout: middleware va server tomoni cookie tekshiruviga moslash uchun bu fayl
// server komponent sifatida ishlaydi. Agar `token` cookie topilmasa, server tarafdan
// `redirect('/login')` bajariladi — bu sahifaga mijoz yetib kelmasdan oldin yo'naltirishni ta'minlaydi.
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ClientDashboardLayout from './ClientDashboardLayout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	// Server-side cookie tekshiruvi
	const cookiesList = await cookies()
	const token = cookiesList.get('token')?.value

	if (!token) {
		// Token yo'q bo'lsa server tomonidan login sahifasiga yo'naltiramiz
		redirect('/login')
	}

	// Agar token mavjud bo'lsa, client-side layoutni render qilamiz
	return <ClientDashboardLayout>{children}</ClientDashboardLayout>
}
