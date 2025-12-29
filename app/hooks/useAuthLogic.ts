'use client'

import { setClientUser } from 'lib/auth/auth.client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { apiFetch } from '../../lib/api/config'

interface AuthForm {
	email: string
	password: string
	name: string
	code: string
}

interface AuthStatus {
	loading: boolean
	error: string
	step: 'login' | 'register' | '2fa'
	userId?: number
}

export function useAuthLogic() {
	const router = useRouter()
	const [form, setForm] = useState<AuthForm>({
		email: '',
		password: '',
		name: '',
		code: '',
	})

	const [status, setStatus] = useState<AuthStatus>({
		loading: false,
		error: '',
		step: 'login',
	})

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		setStatus(s => ({ ...s, loading: true, error: '' }))

		try {
			const result = await apiFetch<
				| { requiresTwoFactor: true; userId: number; message?: string }
				| { success: true; user: any }
				| { success: false; error: string }
			>('/authAPI/login', {
				method: 'POST',
				body: JSON.stringify({ email: form.email, password: form.password }),
			})

			if (!result.success || !result.data) {
				setStatus(s => ({
					...s,
					loading: false,
					error: result.error || 'Failed to login. Please try again.',
				}))
				return
			}

			const data = result.data

			if ('requiresTwoFactor' in data && data.requiresTwoFactor) {
				setStatus(s => ({
					...s,
					loading: false,
					step: '2fa',
					userId: data.userId,
				}))
			} else if ('success' in data && data.success) {
				setStatus(s => ({ ...s, loading: false, error: '' }))
				setClientUser(data.user)
				router.push('/dashboard')
			} else {
				setStatus(s => ({
					...s,
					loading: false,
					error: 'error' in data && data.error ? data.error : 'Invalid email or password',
				}))
			}
		} catch (error) {
			console.error('Login error:', error)
			setStatus(s => ({
				...s,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to login. Please try again.',
			}))
		}
	}

	const handle2FA = async (e: FormEvent) => {
		e.preventDefault()
		setStatus(s => ({ ...s, loading: true, error: '' }))

		try {
			const result = await apiFetch<{ success: boolean; user?: any; error?: string }>(
				'/authAPI/2fa/verify',
				{
					method: 'POST',
					body: JSON.stringify({ userId: status.userId, code: form.code }),
				},
			)

			if (!result.success || !result.data) {
				setStatus(s => ({
					...s,
					loading: false,
					error: result.error || 'Failed to verify code. Please try again.',
				}))
				return
			}

			const data = result.data

			if (data.success) {
				setStatus(s => ({ ...s, loading: false, error: '' }))
				setClientUser(data.user)
				router.push('/dashboard')
			} else {
				setStatus(s => ({
					...s,
					loading: false,
					error: data.error || 'Invalid verification code',
				}))
			}
		} catch (error) {
			console.error('2FA verification error:', error)
			setStatus(s => ({
				...s,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to verify code. Please try again.',
			}))
		}
	}

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault()
		setStatus(s => ({ ...s, loading: true, error: '' }))

		try {
			const result = await apiFetch<{ success: boolean; user?: any; error?: string }>(
				'/authAPI/register',
				{
					method: 'POST',
					body: JSON.stringify({
						email: form.email,
						password: form.password,
						name: form.name,
					}),
				},
			)

			if (!result.success || !result.data) {
				setStatus(s => ({
					...s,
					loading: false,
					error: result.error || 'Failed to register. Please try again.',
				}))
				return
			}

			const data = result.data

			if (data.success) {
				setStatus(s => ({ ...s, loading: false, error: '' }))
				setClientUser(data.user)
				router.push('/dashboard')
			} else {
				setStatus(s => ({
					...s,
					loading: false,
					error: data.error || 'Registration failed',
				}))
			}
		} catch (error) {
			console.error('Registration error:', error)
			setStatus(s => ({
				...s,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to register. Please try again.',
			}))
		}
	}

	return {
		form,
		setForm,
		status,
		setStatus,
		handleLogin,
		handle2FA,
		handleRegister,
	}
}
