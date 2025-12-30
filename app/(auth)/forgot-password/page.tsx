'use client'

import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { ArrowLeft, Check, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPassword() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const [sentEmail, setSentEmail] = useState('')
	const [emailError, setEmailError] = useState('')

	// Email validatsiya funksiyasi
	const validateEmail = (emailValue: string) => {
		if (!emailValue) {
			setEmailError('Email is required')
			return false
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(emailValue)) {
			setEmailError('Please enter a valid email address')
			return false
		}

		setEmailError('')
		return true
	}

	// Email o'zgarganda validatsiya
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setEmail(value)
		if (value) {
			validateEmail(value)
		} else {
			setEmailError('')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setSuccess(false)

		// Email validatsiya
		if (!validateEmail(email)) {
			return
		}

		setLoading(true)

		try {
			const response = await fetch('/authAPI/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(data.error || 'Failed to reset password')
				return
			}

			if (data.success) {
				setSuccess(true)
				setSentEmail(data.email || email)
			}
		} catch (err) {
			console.error('Forgot password error:', err)
			setError('Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Back to Login Link */}
				<Link
					href='/login'
					className='inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'
				>
					<ArrowLeft size={16} />
					Back to Login
				</Link>

				<div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
					{!success ? (
						<>
							{/* Header */}
							<div className='text-center mb-8'>
								<div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4'>
									<KeyRound className='text-blue-600 dark:text-blue-400' size={32} />
								</div>
								<h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
									Forgot Password?
								</h1>
								<p className='text-gray-600 dark:text-gray-400'>
									Don't worry! Enter your email and we'll send you a new password.
								</p>
							</div>

							{/* Error Message */}
							{error && (
								<div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
									<p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
								</div>
							)}

							{/* Form */}
							<form onSubmit={handleSubmit} className='space-y-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
										Email Address
									</label>
									<div className='relative'>
										<Mail
											className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
											size={20}
										/>
										<Input
											type='email'
											value={email}
											onChange={handleEmailChange}
											placeholder='Enter your email'
											required
											disabled={loading}
											className='pl-11'
										/>
									</div>
									{emailError && (
										<p className='text-sm text-red-600 dark:text-red-400 mt-2'>{emailError}</p>
									)}
								</div>

								<Button
									type='submit'
									variant='gradient'
									fullWidth
									loading={loading}
									disabled={loading || !email || !!emailError}
								>
									Reset Password
								</Button>
							</form>

							{/* Additional Info */}
							<div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
								Remember your password?{' '}
								<Link
									href='/login'
									className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
								>
									Sign in
								</Link>
							</div>
						</>
					) : (
						<>
							{/* Success State */}
							<div className='text-center'>
								<div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4'>
									<Check className='text-green-600 dark:text-green-400' size={32} />
								</div>
								<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
									Email Sent Successfully!
								</h2>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									We've sent your new password to <strong>{sentEmail}</strong>
								</p>

								{/* Email Icon Display */}
								<div className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-6'>
									<div className='inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4'>
										<Mail className='text-blue-600 dark:text-blue-400' size={40} />
									</div>
									<p className='text-sm text-gray-700 dark:text-gray-300'>
										Check your inbox for your new temporary password
									</p>
								</div>

								{/* Instructions */}
								<div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left'>
									<p className='text-sm text-blue-900 dark:text-blue-300 font-medium mb-2'>
										📧 Next Steps:
									</p>
									<ol className='text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside'>
										<li>Check your email inbox</li>
										<li>Copy the new password from the email</li>
										<li>Login with your new password</li>
										<li>Change it in Settings → Security</li>
									</ol>
								</div>

								{/* Warning */}
								<div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6'>
									<p className='text-sm text-yellow-800 dark:text-yellow-400'>
										⚠️ <strong>Important:</strong> For security reasons, please change this password
										after logging in from Settings → Security.
									</p>
								</div>

								{/* Action Button */}
								<Link href='/login'>
									<Button variant='gradient' fullWidth>
										Go to Login
									</Button>
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
