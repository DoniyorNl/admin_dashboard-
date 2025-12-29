'use client'

import { Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { AuthLayout } from '@/components/auth/AuthLayout'
import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { useAuthLogic } from '@/hooks/useAuthLogic'

export default function RegisterPage() {
	const { status, form, setForm, handleRegister } = useAuthLogic()
	const [showPass, setShowPass] = useState(false)

	return (
		<AuthLayout
			title='Create Account'
			subtitle='Sign up to get started'
			icon={<UserIcon className='w-8 h-8 text-white' />}
		>
			<form onSubmit={handleRegister} className='space-y-5'>
				<Input
					label='Full Name'
					type='text'
					placeholder='Your name'
					value={form.name}
					onChange={e => setForm({ ...form, name: e.target.value })}
					icon={<UserIcon className='w-5 h-5' />}
					required
				/>

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
					Create Account
				</Button>

				<div className='text-center text-sm text-slate-600 dark:text-slate-400'>
					Already have an account?{' '}
					<Link
						href='/login'
						className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
					>
						Sign in
					</Link>
				</div>
			</form>
		</AuthLayout>
	)
}
