import { AUTH_API_BASE_URL } from 'lib/api/config'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const githubClientId = process.env.GITHUB_CLIENT_ID
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET

const providers: NextAuthOptions['providers'] = [
	// Email/Password (hozirgi login)
	CredentialsProvider({
		name: 'credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' },
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials?.password) {
				throw new Error('Email and password required')
			}

			try {
				const response = await fetch(`${AUTH_API_BASE_URL}/users?email=${credentials.email}`, {
					cache: 'no-store',
				})

				if (!response.ok) {
					throw new Error('Failed to fetch user')
				}

				const users = await response.json()
				const user = users[0]

				if (!user) {
					throw new Error('No user found')
				}

				if (user.password !== credentials.password) {
					throw new Error('Invalid password')
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name,
					role: user.role,
				}
			} catch (error) {
				console.error('Authorization error:', error)
				return null
			}
		},
	}),
]

if (googleClientId && googleClientSecret) {
	providers.unshift(
		GoogleProvider({
			clientId: googleClientId,
			clientSecret: googleClientSecret,
		}),
	)
}

if (githubClientId && githubClientSecret) {
	providers.unshift(
		GitHubProvider({
			clientId: githubClientId,
			clientSecret: githubClientSecret,
			// Ensure we can reliably read user's primary email (GitHub may hide public email).
			authorization: { params: { scope: 'read:user user:email' } },
		}),
	)
}

export const authOptions: NextAuthOptions = {
	providers,

	callbacks: {
		async signIn({ user, account }) {
			// OAuth (Google/GitHub) orqali kirish
			if (account?.provider === 'google' || account?.provider === 'github') {
				try {
					// Foydalanuvchi DB'da bormi tekshirish
					const checkResponse = await fetch(
						`${AUTH_API_BASE_URL}/users?email=${encodeURIComponent(user.email || '')}`,
						{ cache: 'no-store' },
					)

					const existingUsers = await checkResponse.json()

					if (existingUsers.length === 0) {
						// Yangi foydalanuvchi yaratish
						const newUser = {
							email: user.email,
							name: user.name || user.email?.split('@')[0],
							password: null, // OAuth foydalanuvchilarda password yo'q
							role: 'user',
							twoFactorEnabled: false,
							twoFactorSecret: null,
							provider: account.provider, // 'google' yoki 'github'
							providerId: account.providerAccountId,
							image: user.image || null,
						}

						const createResponse = await fetch(`${AUTH_API_BASE_URL}/users`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(newUser),
						})

						if (!createResponse.ok) {
							console.error('Failed to create OAuth user')
							return false
						}

						console.log('✅ New OAuth user created:', user.email)
					} else {
						console.log('✅ Existing OAuth user logged in:', user.email)
					}

					return true
				} catch (error) {
					console.error('OAuth sign-in error:', error)
					return false
				}
			}

			return true
		},

		async jwt({ token, user, account }) {
			// Birinchi marta sign in qilganda
			if (user) {
				const authUser = user as typeof user & { role?: string }
				token.id = user.id
				token.email = user.email
				token.name = user.name
				token.role = authUser.role || 'user'
			}

			// OAuth provider ma'lumotini saqlash
			if (account) {
				token.provider = account.provider
			}

			return token
		},

		async session({ session, token }) {
			// Session'ga token ma'lumotlarini qo'shish
			if (session.user) {
				const enrichedUser = session.user as typeof session.user & {
					id?: string
					role?: string
					provider?: string
				}

				enrichedUser.id = token.id ? String(token.id) : ''
				enrichedUser.role = token.role ? String(token.role) : 'user'
				enrichedUser.provider = token.provider ? String(token.provider) : 'credentials'
			}
			return session
		},

		/**
		 * OAuth sign-in muvaffaqiyatli bo'lgandan so'ng foydalanuvchi
		 * /authAPI/oauth-sync ga yo'naltiriladi — u yerda custom auth_token
		 * cookie o'rnatiladi va /dashboard ga redirect qilinadi.
		 *
		 * Credentials (email/password) oqimida bu callback ishlamaydi chunki
		 * u NextAuth signIn'dan emas, to'g'ridan-to'g'ri /authAPI/login dan o'tadi.
		 */
		async redirect({ url, baseUrl }) {
			// OAuth callback URLlarini oauth-sync orqali o'tkazish
			if (url === `${baseUrl}/authAPI/oauth-sync`) {
				return `${baseUrl}/authAPI/oauth-sync`
			}

			// Relative URL bo'lsa baseUrl ga biriktiramiz
			if (url.startsWith('/')) return `${baseUrl}${url}`

			// Xavfsiz: faqat bir xil origin'ga yo'naltirish
			try {
				if (new URL(url).origin === baseUrl) return url
			} catch {
				// Invalid URL — fallback
			}

			return baseUrl
		},
	},

	pages: {
		signIn: '/login',
		error: '/login',
		newUser: '/authAPI/oauth-sync',
	},

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 kun
	},

	secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-change-in-production',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
