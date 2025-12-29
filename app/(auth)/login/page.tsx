'use client'

import { AuthLayout } from '@/components/auth/AuthLayout'
import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { useAuthLogic } from '@/hooks/useAuthLogic'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
	const { status, setStatus, form, setForm, handleLogin, handle2FA } = useAuthLogic()
	const [showPass, setShowPass] = useState(false)

	// 2FA step
	if (status.step === '2fa') {
		return (
			<AuthLayout
				title='Security Check'
				subtitle='Enter the 6-digit code from your authenticator app'
				icon={<Shield className='w-8 h-8 text-white' />}
			>
				<form onSubmit={handle2FA} className='space-y-6'>
					<Input
						type='text'
						maxLength={6}
						value={form.code}
						onChange={e => setForm({ ...form, code: e.target.value.replace(/\D/g, '') })}
						className='text-center text-3xl font-mono tracking-widest'
						placeholder='000000'
						autoFocus
						required
					/>

					{status.error && (
						<div className='p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'>
							{status.error}
						</div>
					)}

					<Button
						type='submit'
						loading={status.loading}
						disabled={form.code.length !== 6}
						fullWidth
					>
						Verify & Continue
					</Button>

					<Button
						type='button'
						variant='ghost'
						onClick={() => setStatus(s => ({ ...s, step: 'login', error: '' }))}
						fullWidth
					>
						← Back to Login
					</Button>
				</form>
			</AuthLayout>
		)
	}

	// Login step
	return (
		<AuthLayout
			title='Welcome Back'
			subtitle='Sign in to your account'
			icon={<Lock className='w-8 h-8 text-white' />}
		>
			<form onSubmit={handleLogin} className='space-y-5'>
				<Input
					label='Email Address'
					type='email'
					placeholder='name@company.com'
					value={form.email}
					onChange={e => setForm({ ...form, email: e.target.value })}
					icon={<Mail className='w-5 h-5' />}
					required
				/>

				<Input
					label='Password'
					type={showPass ? 'text' : 'password'}
					placeholder='••••••••'
					value={form.password}
					onChange={e => setForm({ ...form, password: e.target.value })}
					icon={<Lock className='w-5 h-5' />}
					required
					rightElement={
						<button
							type='button'
							onClick={() => setShowPass(!showPass)}
							className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none'
							aria-label={showPass ? 'Hide password' : 'Show password'}
							tabIndex={-1}
						>
							{showPass ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					}
				/>

				{status.error && (
					<div className='p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'>
						{status.error}
					</div>
				)}

				<Button type='submit' loading={status.loading} fullWidth>
					Sign In
				</Button>

				<div className='text-center text-sm text-slate-600 dark:text-slate-400'>
					Don&apos;t have an account?{' '}
					<Link
						href='/register'
						className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
					>
						Sign up
					</Link>
				</div>
			</form>
		</AuthLayout>
	)
}
