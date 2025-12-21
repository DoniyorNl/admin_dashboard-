'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ProtectedProps = {
	children: ReactNode
}
export default function Protected({ children }: ProtectedProps) {
	const router = useRouter()
	const [isAllowed, setIsAllowed] = useState<boolean>(false)

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (!token) {
			router.replace('/login')
		} else {
			setIsAllowed(true)
		}
	}, [])

	if (!isAllowed) {
		return null //(Loading...)
	}

	return <>{children}</>
}
