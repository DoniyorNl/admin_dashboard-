// dashboard/components/Protected.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ProtectedProps = {
	children: ReactNode
}
export default function Protected({ children }: ProtectedProps) {
	const router = useRouter()
	const [isAllowed, setIsAllowed] = useState<boolean>(false)
	const [checking, setChecking] = useState<boolean>(true)

	useEffect(() => {
		// Synchronously check localStorage for token copy set during login/register.
		try {
			const token = localStorage.getItem('token')

			if (!token) {
				// No client token — redirect to login
				router.replace('/login')
			} else {
				setIsAllowed(true)
			}
		} catch (e) {
			// If any error accessing storage, redirect to login for safety
			router.replace('/login')
		} finally {
			setChecking(false)
		}
	}, [router])

	if (checking) {
		// Minimal client-side loader while auth check happens
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-pulse text-slate-500'>Loading…</div>
			</div>
		)
	}

	if (!isAllowed) {
		return null //(Loading...)
	}

	return <>{children}</>
}
