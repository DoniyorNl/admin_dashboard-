import { AUTH_API_BASE_URL } from 'lib/api/config'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
	providers: [
		// Google OAuth
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),

		// GitHub OAuth
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
		}),

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
					// Hozirgi login API orqali tekshirish
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

					// Password tekshirish (hozircha oddiy tekshiruv - production'da bcrypt ishlating)
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
	],

	callbacks: {
		async signIn({ user, account, profile }) {
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
				token.id = user.id
				token.email = user.email
				token.name = user.name
				token.role = (user as any).role || 'user'
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
				;(session.user as any).id = token.id
				;(session.user as any).role = token.role
				;(session.user as any).provider = token.provider
			}
			return session
		},
	},

	pages: {
		signIn: '/login',
		error: '/login',
	},

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 kun
	},

	secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-change-in-production',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
