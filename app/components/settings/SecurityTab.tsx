'use client'

import { Eye, EyeOff, Lock, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'

interface SecurityTabProps {
	security: any
	setSecurity: (security: any) => void
	toggle2FA: (enabled: boolean) => Promise<{ success: boolean; qrCode?: string; secret?: string }>
	saving: boolean
}

export default function SecurityTab({
	security,
	setSecurity,
	toggle2FA,
	saving,
}: SecurityTabProps) {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [show2FAModal, setShow2FAModal] = useState(false)
	const [qrCode, setQrCode] = useState('')
	const [secret, setSecret] = useState('')
	const [verificationCode, setVerificationCode] = useState('')
	const [verifyError, setVerifyError] = useState('')
	const [verifyLoading, setVerifyLoading] = useState(false)

	// Password validation state
	const passwordValidation = useMemo(() => {
		const newPass = security.newPassword || ''
		const confirmPass = security.confirmPassword || ''

		return {
			length: newPass.length >= 8,
			match: newPass && confirmPass && newPass === confirmPass,
			showMatch: confirmPass.length > 0,
		}
	}, [security.newPassword, security.confirmPassword])

	const handle2FAToggle = async () => {
		if (security.twoFactorEnabled) {
			// Disable 2FA
			const result = await toggle2FA(false)
			if (result.success) {
				setSecurity({ ...security, twoFactorEnabled: false })
			}
		} else {
			// Enable 2FA - show QR code modal
			const result = await toggle2FA(true)
			if (result.success && result.qrCode && result.secret) {
				setQrCode(result.qrCode)
				setSecret(result.secret)
				setShow2FAModal(true)
				setVerifyError('')
			}
		}
	}

	const verify2FACode = async () => {
		setVerifyLoading(true)
		setVerifyError('')

		try {
			// Get userId from localStorage or auth context
			const userStr = localStorage.getItem('user')
			const user = userStr ? JSON.parse(userStr) : null

			if (!user?.id) {
				setVerifyError('User authentication required')
				setVerifyLoading(false)
				return
			}

			const response = await fetch('/authAPI/2fa/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: user.id,
					code: verificationCode,
				}),
			})

			const data = await response.json()

			if (response.ok && data.success) {
				setSecurity({ ...security, twoFactorEnabled: true })
				setShow2FAModal(false)
				setVerificationCode('')
				setVerifyError('')
			} else {
				setVerifyError(data.error || 'Invalid verification code')
			}
		} catch (error) {
			console.error('2FA verification failed:', error)
			setVerifyError('Failed to verify code. Please try again.')
		} finally {
			setVerifyLoading(false)
		}
	}

	return (
		<div className='space-y-6'>
			{/* Change Password Section */}
			<div>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
					Change Password
				</h3>

				<div className='space-y-4'>
					{/* Current Password */}
					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Current Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
							<input
								type={showCurrentPassword ? 'text' : 'password'}
								value={security.currentPassword || ''}
								onChange={e => setSecurity({ ...security, currentPassword: e.target.value })}
								className='w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Enter current password'
							/>
							<button
								type='button'
								onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
							>
								{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					{/* New Password */}
					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							New Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
							<input
								type={showNewPassword ? 'text' : 'password'}
								value={security.newPassword || ''}
								onChange={e => setSecurity({ ...security, newPassword: e.target.value })}
								className='w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Enter new password'
							/>
							<button
								type='button'
								onClick={() => setShowNewPassword(!showNewPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
							>
								{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{security.newPassword && (
							<p
								className={`text-sm mt-1 ${
									passwordValidation.length
										? 'text-green-600 dark:text-green-400'
										: 'text-red-600 dark:text-red-400'
								}`}
							>
								{passwordValidation.length
									? '✓ Password length is valid'
									: '✗ Password must be at least 8 characters'}
							</p>
						)}
					</div>

					{/* Confirm Password */}
					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Confirm New Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								value={security.confirmPassword || ''}
								onChange={e => setSecurity({ ...security, confirmPassword: e.target.value })}
								className='w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Confirm new password'
							/>
							<button
								type='button'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
							>
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{passwordValidation.showMatch && (
							<p
								className={`text-sm mt-1 ${
									passwordValidation.match
										? 'text-green-600 dark:text-green-400'
										: 'text-red-600 dark:text-red-400'
								}`}
							>
								{passwordValidation.match ? '✓ Passwords match' : '✗ Passwords do not match'}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* 2FA Section */}
			<div>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
					Two-Factor Authentication
				</h3>

				<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'>
					<div className='flex items-start gap-3'>
						<div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
							<Smartphone className='text-blue-600 dark:text-blue-400' size={20} />
						</div>
						<div>
							<p className='font-medium text-gray-900 dark:text-white'>Two-Factor Authentication</p>
							<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
								{security.twoFactorEnabled ? (
									<span className='text-green-600 dark:text-green-400 font-medium'>✓ Enabled</span>
								) : (
									<span className='text-gray-500'>Disabled</span>
								)}
							</p>
							<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
								Add an extra layer of security to your account
							</p>
						</div>
					</div>

					<button
						onClick={handle2FAToggle}
						disabled={saving}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
						} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
							}`}
						/>
					</button>
				</div>
			</div>

			{/* 2FA Setup Modal */}
			{show2FAModal && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6'>
						<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
							Setup Two-Factor Authentication
						</h3>

						<div className='space-y-4'>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
							</p>

							{/* QR Code */}
							<div className='flex justify-center p-4 bg-white rounded-lg'>
								<img src={qrCode} alt='2FA QR Code' className='w-48 h-48' />
							</div>

							{/* Manual Secret */}
							<div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
								<p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
									Or enter this code manually:
								</p>
								<code className='text-sm font-mono text-gray-900 dark:text-white break-all'>
									{secret}
								</code>
							</div>

							{/* Verification Code */}
							<div>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Enter 6-digit code from your app
								</label>
								<input
									type='text'
									value={verificationCode}
									onChange={e => {
										setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
										setVerifyError('')
									}}
									className='w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									placeholder='000000'
									maxLength={6}
									disabled={verifyLoading}
								/>
								{verifyError && (
									<p className='text-sm text-red-600 dark:text-red-400 mt-2'>{verifyError}</p>
								)}
							</div>

							{/* Actions */}
							<div className='flex gap-3'>
								<button
									onClick={() => {
										setShow2FAModal(false)
										setVerificationCode('')
										setVerifyError('')
									}}
									disabled={verifyLoading}
									className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
								>
									Cancel
								</button>
								<button
									onClick={verify2FACode}
									disabled={verificationCode.length !== 6 || verifyLoading}
									className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
								>
									{verifyLoading ? 'Verifying...' : 'Verify & Enable'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
