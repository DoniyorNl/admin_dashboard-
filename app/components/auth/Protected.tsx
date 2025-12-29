'use client'

import { clearClientAuth, getClientUser, setClientUser } from 'lib/auth/auth.client'
import { AuthMeResponse, User } from 'lib/auth/types'
import { AlertCircle, Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type AuthState =
	| { status: 'checking'; user: null; error: null }
	| { status: 'authed'; user: User; error: null }
	| { status: 'unauthed'; user: null; error: string }

export default function Protected({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const [auth, setAuth] = useState<AuthState>({ status: 'checking', user: null, error: null })

	// Himoya qilinmaydigan sahifalar (agar Protected tasodifan auth group’da ishlatilsa ham loop bo‘lmasin)
	const isPublicAuthPage = pathname === '/login' || pathname === '/register'

	useEffect(() => {
		if (isPublicAuthPage) {
			setAuth({ status: 'authed', user: { id: -1, email: '', name: '', role: '' }, error: null })
			return
		}

		let alive = true
		const controller = new AbortController()

		const run = async () => {
			setAuth({ status: 'checking', user: null, error: null })

			try {
				const res = await fetch('/authAPI/me', {
					method: 'GET',
					credentials: 'include',
					cache: 'no-store',
					signal: controller.signal,
				})

				if (res.ok) {
					const data = (await res.json()) as AuthMeResponse
					const user = 'user' in data ? data.user : null
					if (!user) {
						throw new Error('Invalid /authAPI/me response')
					}
					if (!alive) return
					setClientUser(user)
					setAuth({ status: 'authed', user, error: null })
					return
				}

				// 401/403 bo‘lsa: localStorage fallback
				const local = getClientUser()
				if (local) {
					if (!alive) return
					setAuth({ status: 'authed', user: local, error: null })
					return
				}

				// To‘liq unauth
				if (!alive) return
				clearClientAuth()
				setAuth({ status: 'unauthed', user: null, error: 'Please sign in to continue' })
				router.replace('/login')
			} catch (e) {
				// Fetch abort bo‘lsa jim
				if (!alive) return
				const local = getClientUser()
				if (local) {
					setAuth({ status: 'authed', user: local, error: null })
					return
				}
				clearClientAuth()
				setAuth({ status: 'unauthed', user: null, error: 'Failed to verify authentication' })
				router.replace('/login')
			}
		}

		run()

		return () => {
			alive = false
			controller.abort()
		}
	}, [pathname, isPublicAuthPage, router])

	if (isPublicAuthPage) return <>{children}</>

	if (auth.status === 'checking') {
		return (
			<div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
				<div className='text-center space-y-4'>
					<Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto' />
					<p className='text-slate-600 font-medium animate-pulse'>
						Xavfsiz ulanish tekshirilmoqda...
					</p>
				</div>
			</div>
		)
	}

	if (auth.status === 'unauthed') {
		return (
			<div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
				<div className='max-w-md w-full p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4'>
					<AlertCircle className='w-10 h-10 text-red-600 mx-auto' />
					<h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
						Authentication Required
					</h2>
					<p className='text-slate-600 dark:text-slate-300'>{auth.error}</p>
					<button
						onClick={() => (window.location.href = '/login')}
						className='w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700'
					>
						Go to Login
					</button>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
