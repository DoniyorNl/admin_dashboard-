'use client'

import NotificationsTab from '@/components/settings/NotificationsTab'
import PreferencesTab from '@/components/settings/PreferencesTab'
import ProfileTab from '@/components/settings/ProfileTab'
import SecurityTab from '@/components/settings/SecurityTab'
import Button from '@/components/UI/Button'
import { useSettings } from '@/hooks/useSettings'
import { AlertCircle, Bell, CheckCircle, Palette, Save, Shield, User, X } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function Settings() {
	const [activeTab, setActiveTab] = useState('profile')
	const settings = useSettings()

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'preferences', label: 'Preferences', icon: Palette },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'security', label: 'Security', icon: Shield },
	]

	// ✅ Profile uchun save handler
	const handleSaveProfile = useCallback(async () => {
		try {
			await settings.updateProfile(settings.profile)
		} catch (error) {
			console.error('Failed to save profile:', error)
			// Error settings.error state ichida handle qilinadi
		}
	}, [settings])

	// ✅ Preferences uchun save handler
	const handleSavePreferences = useCallback(async () => {
		try {
			await settings.updatePreferences(settings.preferences)
		} catch (error) {
			console.error('Failed to save preferences:', error)
		}
	}, [settings])

	// ✅ Notifications uchun save handler
	const handleSaveNotifications = useCallback(async () => {
		try {
			await settings.updateNotifications(settings.notifications)
		} catch (error) {
			console.error('Failed to save notifications:', error)
		}
	}, [settings])

	// ✅ Security uchun save handler (faqat password change)
	const handleChangePassword = useCallback(async () => {
		// Validate all fields are filled
		if (
			!settings.security.currentPassword ||
			!settings.security.newPassword ||
			!settings.security.confirmPassword
		) {
			settings.setError?.('Please fill in all password fields')
			return
		}

		// Validate passwords match
		if (settings.security.newPassword !== settings.security.confirmPassword) {
			settings.setError?.('New passwords do not match')
			return
		}

		// Validate password length
		if (settings.security.newPassword.length < 8) {
			settings.setError?.('New password must be at least 8 characters')
			return
		}

		try {
			await settings.changePassword({
				currentPassword: settings.security.currentPassword,
				newPassword: settings.security.newPassword,
			})
		} catch (error) {
			console.error('Failed to change password:', error)
		}
	}, [settings])

	// ✅ Cancel handler - reset to original values
	const handleCancel = useCallback(() => {
		settings.refetch()
		// Clear any errors
		settings.clearError?.()
	}, [settings])

	if (settings.loading) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>Loading settings...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Settings</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						Manage your account settings and preferences
					</p>
				</div>

				{/* Success Toast */}
				{settings.success && (
					<div className='fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in'>
						<CheckCircle size={20} />
						<span>Settings saved successfully!</span>
					</div>
				)}

				{/* Error Toast */}
				{settings.error && (
					<div className='fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in'>
						<AlertCircle size={20} />
						<span>{settings.error}</span>
						<button
							onClick={settings.clearError}
							className='ml-2 hover:bg-red-600 rounded p-1 transition-colors'
							aria-label='Close error'
						>
							<X size={18} />
						</button>
					</div>
				)}

				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{/* Tabs Navigation */}
					<div className='border-b border-gray-200 dark:border-gray-700'>
						<nav className='flex overflow-x-auto'>
							{tabs.map(tab => {
								const Icon = tab.icon
								return (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										disabled={settings.saving}
										className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
											activeTab === tab.id
												? 'border-blue-500 text-blue-600 dark:text-blue-400'
												: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
										} ${settings.saving ? 'opacity-50 cursor-not-allowed' : ''}`}
									>
										<Icon size={20} />
										{tab.label}
									</button>
								)
							})}
						</nav>
					</div>

					{/* Tab Content */}
					<div className='p-6'>
						{/* ✅ ProfileTab - onSave prop bilan */}
						{activeTab === 'profile' && (
							<ProfileTab
								profile={settings.profile}
								setProfile={settings.setProfile}
								uploadAvatar={settings.uploadAvatar}
								onSave={handleSaveProfile}
								saving={settings.saving}
							/>
						)}

						{/* ✅ PreferencesTab - Save button alohida */}
						{activeTab === 'preferences' && (
							<>
								<PreferencesTab
									preferences={settings.preferences}
									setPreferences={settings.setPreferences}
								/>
								<div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
									<Button variant='outline' onClick={handleCancel} disabled={settings.saving}>
										Cancel
									</Button>
									<Button
										variant='gradient'
										onClick={handleSavePreferences}
										loading={settings.saving}
										disabled={settings.saving}
										icon={<Save size={18} />}
									>
										Save Changes
									</Button>
								</div>
							</>
						)}

						{/* ✅ NotificationsTab - Save button alohida */}
						{activeTab === 'notifications' && (
							<>
								<NotificationsTab
									notifications={settings.notifications}
									setNotifications={settings.setNotifications}
								/>
								<div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
									<Button variant='outline' onClick={handleCancel} disabled={settings.saving}>
										Cancel
									</Button>
									<Button
										variant='gradient'
										onClick={handleSaveNotifications}
										loading={settings.saving}
										disabled={settings.saving}
										icon={<Save size={18} />}
									>
										Save Changes
									</Button>
								</div>
							</>
						)}

						{/* ✅ SecurityTab - Faqat password change uchun save button */}
						{activeTab === 'security' && (
							<>
								<SecurityTab
									security={settings.security}
									setSecurity={settings.setSecurity}
									toggle2FA={settings.toggle2FA}
									saving={settings.saving}
								/>
								{/* Faqat password fields to'ldirilgan bo'lsa Save button ko'rsatish */}
								{(settings.security.currentPassword ||
									settings.security.newPassword ||
									settings.security.confirmPassword) && (
									<div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
										<Button variant='outline' onClick={handleCancel} disabled={settings.saving}>
											Cancel
										</Button>
										<Button
											variant='gradient'
											onClick={handleChangePassword}
											loading={settings.saving}
											disabled={settings.saving}
											icon={<Save size={18} />}
										>
											Change Password
										</Button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
