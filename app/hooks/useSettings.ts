// hooks/useSettings.ts
import { useEffect, useState } from 'react'
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

	// Fetch all settings on mount
	useEffect(() => {
		fetchAllSettings()
	}, [])

	const safeErrMessage = (err: unknown) => {
		if (!err) return 'Unknown error'
		if (err instanceof Error) return err.message
		try {
			return String(err)
		} catch {
			return 'Unknown error'
		}
	}

	const fetchAllSettings = async (): Promise<void> => {
		try {
			setLoading(true)
			const [profileData, preferencesData, notificationsData] = await Promise.all([
				settingsApi.profile.get(),
				settingsApi.preferences.get(),
				settingsApi.notifications.get(),
			])

			setProfile(profileData)
			setPreferences(preferencesData)
			setNotifications(notificationsData)
			setError(null)
		} catch (err: unknown) {
			setError(safeErrMessage(err))
		} finally {
			setLoading(false)
		}
	}

	// Profile methods
	const updateProfile = async (
		updatedProfile: Partial<Profile>,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setSaving(true)
			const data = await settingsApi.profile.update(updatedProfile)
			setProfile(data)
			showSuccess()
			return { success: true }
		} catch (err: unknown) {
			const msg = safeErrMessage(err)
			setError(msg)
			return { success: false, error: msg }
		} finally {
			setSaving(false)
		}
	}

	const uploadAvatar = async (
		file: File,
		onProgress?: (p: number) => void,
	): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
		try {
			setSaving(true)
			const data = await settingsApi.profile.uploadAvatar(file, onProgress)
			setProfile(prev => ({ ...prev, avatar: (data as any).avatarUrl }))
			showSuccess()
			return { success: true, avatarUrl: (data as any).avatarUrl }
		} catch (err: unknown) {
			const msg = safeErrMessage(err)
			setError(msg)
			return { success: false, error: msg }
		} finally {
			setSaving(false)
		}
	}

	// Preferences methods
	const updatePreferences = async (
		updatedPreferences: Partial<Preferences>,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setSaving(true)
			const data = await settingsApi.preferences.update(updatedPreferences)
			setPreferences(data)
			showSuccess()
			return { success: true }
		} catch (err: unknown) {
			const msg = safeErrMessage(err)
			setError(msg)
			return { success: false, error: msg }
		} finally {
			setSaving(false)
		}
	}

	// Notifications methods
	const updateNotifications = async (
		updatedNotifications: Partial<Notifications>,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setSaving(true)
			const data = await settingsApi.notifications.update(updatedNotifications)
			setNotifications(data)
			showSuccess()
			return { success: true }
		} catch (err: unknown) {
			const msg = safeErrMessage(err)
			setError(msg)
			return { success: false, error: msg }
		} finally {
			setSaving(false)
		}
	}

	// Security methods
	const changePassword = async (passwordData: {
		currentPassword: string
		newPassword: string
	}): Promise<{ success: boolean; error?: string }> => {
		try {
			setSaving(true)
			await settingsApi.security.changePassword(passwordData)
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
			return { success: false, error: msg }
		} finally {
			setSaving(false)
		}
	}

	const toggle2FA = async (enabled: boolean) => {
		try {
			setSaving(true)

			if (enabled) {
				// Enable 2FA - get QR code
				const response = await fetch('/authAPI/2fa/enable', { method: 'POST' })
				const data = await response.json()
				return data
			} else {
				// Disable 2FA
				await fetch('/authAPI/2fa/disable', { method: 'POST' })
				return { success: true }
			}
		} catch (error) {
			return { success: false }
		} finally {
			setSaving(false)
		}
	}

	// Helper methods
	const showSuccess = () => {
		setSuccess(true)
		setTimeout(() => setSuccess(false), 3000)
	}

	const clearError = () => setError(null)

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
		clearError,
		refetch: fetchAllSettings,
	}
}
