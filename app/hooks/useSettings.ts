// hooks/useSettings.ts
import { useEffect, useState, useCallback } from 'react'
import { settingsApi } from '../../services/settings/settingsapi'

type Maybe<T> = T | null

export type Profile = {
	firstName: string
	lastName: string
	email: string
	phone: string
	role: string
	bio: string
	avatar: string | null
}

export type Preferences = {
	theme: string
	language: string
	currency: string
	timezone: string
}

export type Notifications = {
	emailOrders: boolean
	emailCustomers: boolean
	emailProducts: boolean
	systemAlerts: boolean
	systemUpdates: boolean
	weeklyReports: boolean
}

export type Security = {
	currentPassword: string
	newPassword: string
	confirmPassword: string
	twoFactorEnabled: boolean
}

export const useSettings = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [saving, setSaving] = useState<boolean>(false)
	const [error, setError] = useState<Maybe<string>>(null)
	const [success, setSuccess] = useState<boolean>(false)

	const [profile, setProfile] = useState<Profile>({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		role: '',
		bio: '',
		avatar: null,
	})

	const [preferences, setPreferences] = useState<Preferences>({
		theme: 'light',
		language: 'en',
		currency: 'USD',
		timezone: 'UTC',
	})

	const [notifications, setNotifications] = useState<Notifications>({
		emailOrders: true,
		emailCustomers: true,
		emailProducts: false,
		systemAlerts: true,
		systemUpdates: false,
		weeklyReports: true,
	})

	const [security, setSecurity] = useState<Security>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		twoFactorEnabled: false,
	})

	// ✅ Helper: Safe error message extraction
	const safeErrMessage = useCallback((err: unknown): string => {
		if (!err) return 'Unknown error'
		if (err instanceof Error) return err.message
		if (typeof err === 'string') return err
		try {
			return JSON.stringify(err)
		} catch {
			return 'Unknown error'
		}
	}, [])

	// ✅ Helper: Show success message (auto-hide after 3s)
	const showSuccess = useCallback(() => {
		setSuccess(true)
		setError(null) // Clear any existing errors
		setTimeout(() => setSuccess(false), 3000)
	}, [])

	// ✅ Helper: Clear error
	const clearError = useCallback(() => {
		setError(null)
	}, [])

	// ✅ Fetch all settings on mount
	const fetchAllSettings = useCallback(async (): Promise<void> => {
		try {
			setLoading(true)
			setError(null)

			// Fetch all settings in parallel
			const [profileData, preferencesData, notificationsData, securityData] = await Promise.all([
				settingsApi.profile.get(),
				settingsApi.preferences.get(),
				settingsApi.notifications.get(),
				settingsApi.security.get(),
			])

			setProfile(profileData)
			setPreferences(preferencesData)
			setNotifications(notificationsData)
			setSecurity(prev => ({
				...prev,
				twoFactorEnabled: securityData.twoFactorEnabled,
			}))
		} catch (err: unknown) {
			const errorMsg = safeErrMessage(err)
			setError(errorMsg)
			console.error('Failed to fetch settings:', errorMsg)
		} finally {
			setLoading(false)
		}
	}, [safeErrMessage])

	// ✅ Profile: Update profile
	const updateProfile = useCallback(
		async (updatedProfile: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				const data = await settingsApi.profile.update(updatedProfile)
				setProfile(data)
				showSuccess()

				return { success: true }
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to update profile:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Profile: Upload avatar with progress
	const uploadAvatar = useCallback(
		async (
			file: File,
			onProgress?: (progress: number) => void,
		): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				const data = await settingsApi.profile.uploadAvatar(file, onProgress)

				// Type-safe avatar URL extraction
				const avatarUrl =
					typeof data === 'object' && data !== null && 'avatarUrl' in data
						? (data as { avatarUrl: string }).avatarUrl
						: null

				if (avatarUrl) {
					setProfile(prev => ({ ...prev, avatar: avatarUrl }))
					showSuccess()
					return { success: true, avatarUrl }
				} else {
					throw new Error('Avatar URL not returned from server')
				}
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to upload avatar:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Preferences: Update preferences
	const updatePreferences = useCallback(
		async (
			updatedPreferences: Partial<Preferences>,
		): Promise<{ success: boolean; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				const data = await settingsApi.preferences.update(updatedPreferences)
				setPreferences(data)
				showSuccess()

				return { success: true }
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to update preferences:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Notifications: Update notifications
	const updateNotifications = useCallback(
		async (
			updatedNotifications: Partial<Notifications>,
		): Promise<{ success: boolean; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				const data = await settingsApi.notifications.update(updatedNotifications)
				setNotifications(data)
				showSuccess()

				return { success: true }
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to update notifications:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Security: Change password
	const changePassword = useCallback(
		async (passwordData: {
			currentPassword: string
			newPassword: string
		}): Promise<{ success: boolean; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				// Validate passwords
				if (!passwordData.currentPassword || !passwordData.newPassword) {
					throw new Error('Please provide both current and new password')
				}

				if (passwordData.newPassword.length < 8) {
					throw new Error('New password must be at least 8 characters')
				}

				await settingsApi.security.changePassword(passwordData)

				// Clear password fields on success
				setSecurity(prev => ({
					...prev,
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				}))

				showSuccess()
				return { success: true }
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to change password:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Security: Toggle 2FA
	const toggle2FA = useCallback(
		async (enabled: boolean): Promise<{ success: boolean; qrCode?: string; error?: string }> => {
			try {
				setSaving(true)
				setError(null)

				let result: { success: boolean; qrCode?: string }

				if (enabled) {
					// Enable 2FA
					result = await settingsApi.security.enable2FA()
				} else {
					// Disable 2FA
					result = await settingsApi.security.disable2FA()
				}

				if (result.success) {
					// Update state
					setSecurity(prev => ({
						...prev,
						twoFactorEnabled: enabled,
					}))

					showSuccess()
					return { success: true, qrCode: result.qrCode }
				} else {
					throw new Error('Failed to toggle 2FA')
				}
			} catch (err: unknown) {
				const msg = safeErrMessage(err)
				setError(msg)
				console.error('Failed to toggle 2FA:', msg)
				return { success: false, error: msg }
			} finally {
				setSaving(false)
			}
		},
		[safeErrMessage, showSuccess],
	)

	// ✅ Fetch settings on mount
	useEffect(() => {
		fetchAllSettings()
	}, [fetchAllSettings])

	return {
		// State
		loading,
		saving,
		error,
		success,
		profile,
		preferences,
		notifications,
		security,

		// Profile methods
		updateProfile,
		uploadAvatar,
		setProfile,

		// Preferences methods
		updatePreferences,
		setPreferences,

		// Notifications methods
		updateNotifications,
		setNotifications,

		// Security methods
		changePassword,
		toggle2FA,
		setSecurity,

		// Helper methods
		setError, // ✅ Qo'shildi!
		clearError,
		refetch: fetchAllSettings,
	}
}
