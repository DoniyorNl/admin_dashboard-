'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from 'lib/auth'

export default function LoginPage() {
	const router = useRouter()

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			await login({ username, password })
			router.push('/dashboard')
		} catch (err) {
			setError('Invalid username or password')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='w-full max-w-md rounded-xl bg-white p-8 shadow-lg
                    dark:bg-slate-900'
		>
			<h2 className='text-2xl font-semibold text-center text-slate-900 dark:text-slate-100'>
				Sign in to your account
			</h2>

			<form onSubmit={handleSubmit} className='mt-6 space-y-4'>
				<input
					type='text'
					placeholder='Email or username'
					value={username}
					onChange={e => setUsername(e.target.value)}
					className='w-full rounded-lg border px-4 py-2 text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
					required
				/>

				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					className='w-full rounded-lg border px-4 py-2 text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:bg-slate-800 dark:border-slate-700 dark:text-slate-700'
					required
				/>

				{error && <p className='text-sm text-red-600 text-center'>{error}</p>}

				<button
					type='submit'
					disabled={loading}
					className='w-full rounded-lg bg-emerald-600 py-2 text-white
                     hover:bg-emerald-700 transition
                     disabled:opacity-60'
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>

			<p className='mt-4 text-center text-sm text-slate-500'>Forgot password?</p>
		</div>
	)
}
