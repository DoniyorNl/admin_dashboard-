'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from 'lib/auth'

export default function RegisterPage() {
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
			await register({ username, password })
			router.push('/dashboard')
		} catch (err) {
			setError('Registration failed. Try another username.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='w-full max-w-md rounded-xl bg-white p-8 shadow-lg
                    dark:bg-slate-900 dark:shadow-slate-800'
		>
			<h1 className='text-2xl font-semibold text-center text-slate-900 dark:text-slate-100'>
				Create your account
			</h1>

			<p className='mt-1 text-center text-sm text-slate-500 dark:text-slate-400'>
				Sign up to get started
			</p>

			<form onSubmit={handleSubmit} className='mt-6 space-y-4'>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={e => setUsername(e.target.value)}
					className='w-full rounded-lg border px-4 py-2 text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
					required
				/>

				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					className='w-full rounded-lg border px-4 py-2 text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
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
					{loading ? 'Creating account...' : 'Register'}
				</button>
			</form>

			<p className='mt-4 text-center text-sm text-slate-500'>
				Already have an account?{' '}
				<span
					onClick={() => router.push('/login')}
					className='cursor-pointer text-emerald-600 hover:underline'
				>
					Sign in
				</span>
			</p>
		</div>
	)
}
