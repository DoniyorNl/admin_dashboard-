'use client'

import NotificationsTab from '@/components/settings/NotificationsTab'
import PreferencesTab from '@/components/settings/PreferencesTab'
import ProfileTab from '@/components/settings/ProfileTab'
import SecurityTab from '@/components/settings/SecurityTab'
import Button from '@/components/UI/Button'
import { useSettings } from '@/hooks/useSettings'
import { AlertCircle, Bell, CheckCircle, Palette, Save, Shield, User, X } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
	const [activeTab, setActiveTab] = useState('profile')
	const settings = useSettings()

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'preferences', label: 'Preferences', icon: Palette },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'security', label: 'Security', icon: Shield },
	]

	const handleSave = async () => {
		switch (activeTab) {
			case 'profile':
				await settings.updateProfile(settings.profile)
				break
			case 'preferences':
				await settings.updatePreferences(settings.preferences)
				break
			case 'notifications':
				await settings.updateNotifications(settings.notifications)
				break
			case 'security':
				// 2FA uchun Save Changes ishlatilmaydi - toggle2FA alohida
				// Faqat password change uchun
				if (settings.security.currentPassword && settings.security.newPassword) {
					await settings.changePassword({
						currentPassword: settings.security.currentPassword,
						newPassword: settings.security.newPassword,
					})
				}
				break
			default:
				break
		}
	}

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
						<button onClick={settings.clearError} className='ml-2'>
							<X size={18} />
						</button>
					</div>
				)}

				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{/* Tabs Navigation */}
					<div className='border-b border-gray-200 dark:border-gray-700'>
						<nav className='flex'>
							{tabs.map(tab => {
								const Icon = tab.icon
								return (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
											activeTab === tab.id
												? 'border-blue-500 text-blue-600 dark:text-blue-400'
												: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
										}`}
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
						{activeTab === 'profile' && (
							<ProfileTab
								profile={settings.profile}
								setProfile={settings.setProfile}
								uploadAvatar={settings.uploadAvatar}
								saving={settings.saving}
							/>
						)}

						{activeTab === 'preferences' && (
							<PreferencesTab
								preferences={settings.preferences}
								setPreferences={settings.setPreferences}
							/>
						)}

						{activeTab === 'notifications' && (
							<NotificationsTab
								notifications={settings.notifications}
								setNotifications={settings.setNotifications}
							/>
						)}

						{activeTab === 'security' && (
							<SecurityTab
								security={settings.security}
								setSecurity={settings.setSecurity}
								toggle2FA={settings.toggle2FA}
								saving={settings.saving}
							/>
						)}

						{/* Save Button - Security tab uchun conditional */}
						<div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
							<Button variant='outline' onClick={() => settings.refetch()}>
								Cancel
							</Button>
							{activeTab !== 'security' ? (
								<Button
									variant='gradient'
									onClick={handleSave}
									loading={settings.saving}
									icon={<Save size={18} />}
								>
									Save Changes
								</Button>
							) : (
								settings.security.currentPassword &&
								settings.security.newPassword && (
									<Button
										variant='gradient'
										onClick={handleSave}
										loading={settings.saving}
										icon={<Save size={18} />}
									>
										Change Password
									</Button>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
