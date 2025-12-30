// services/settings/settingsapi.ts
// Lightweight local settings API (localStorage-backed) for demo use
// This replaces an external API so the settings components work offline

// ===========================
// Types
// ===========================

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

export type SecurityStatus = {
	twoFactorEnabled: boolean
}

export type PasswordChangeData = {
	currentPassword: string
	newPassword: string
}

// ===========================
// Constants
// ===========================

const STORAGE_PREFIX = 'admindash.settings.'

const DEFAULT_PROFILE: Profile = {
	firstName: 'John',
	lastName: 'Doe',
	email: 'john.doe@example.com',
	phone: '+1 234 567 8900',
	role: 'Admin',
	bio: 'E-commerce platform administrator',
	avatar: null,
}

const DEFAULT_PREFERENCES: Preferences = {
	theme: 'light',
	language: 'en',
	currency: 'USD',
	timezone: 'UTC',
}

const DEFAULT_NOTIFICATIONS: Notifications = {
	emailOrders: true,
	emailCustomers: true,
	emailProducts: false,
	systemAlerts: true,
	systemUpdates: false,
	weeklyReports: true,
}

const DEFAULT_SECURITY: SecurityStatus = {
	twoFactorEnabled: false,
}

// ===========================
// Storage Helpers
// ===========================

/**
 * Safely read a key from localStorage with fallback
 */
function readKey<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(STORAGE_PREFIX + key)
		if (!raw) return fallback

		const parsed = JSON.parse(raw)
		return parsed as T
	} catch (error) {
		console.warn(`Failed to read key "${key}":`, error)
		return fallback
	}
}

/**
 * Safely write a key to localStorage
 */
function writeKey<T>(key: string, value: T): boolean {
	try {
		const serialized = JSON.stringify(value)
		localStorage.setItem(STORAGE_PREFIX + key, serialized)
		return true
	} catch (error) {
		console.error(`Failed to write key "${key}":`, error)
		return false
	}
}

/**
 * Simulate network delay for realistic API behavior
 */
function delay(ms: number = 300): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// ===========================
// API Implementation
// ===========================

export const settingsApi = {
	// ===========================
	// Profile API
	// ===========================
	profile: {
		/**
		 * Get user profile
		 */
		get: async (): Promise<Profile> => {
			await delay(200)
			return readKey<Profile>('profile', DEFAULT_PROFILE)
		},

		/**
		 * Update user profile
		 */
		update: async (data: Partial<Profile>): Promise<Profile> => {
			await delay(400)

			const currentProfile = readKey<Profile>('profile', DEFAULT_PROFILE)
			const updatedProfile: Profile = { ...currentProfile, ...data }

			const success = writeKey<Profile>('profile', updatedProfile)

			if (!success) {
				throw new Error('Failed to save profile to storage')
			}

			return updatedProfile
		},

		/**
		 * Upload avatar with progress simulation
		 */
		uploadAvatar: async (
			file: File,
			onProgress?: (progress: number) => void,
		): Promise<{ avatarUrl: string }> => {
			// Validate file
			if (!file.type.startsWith('image/')) {
				throw new Error('File must be an image')
			}

			if (file.size > 2 * 1024 * 1024) {
				throw new Error('File size must be less than 2MB')
			}

			return new Promise((resolve, reject) => {
				const reader = new FileReader()

				// Handle successful read
				reader.onload = () => {
					const dataUrl = reader.result as string

					// Update profile with new avatar
					const currentProfile = readKey<Profile>('profile', DEFAULT_PROFILE)
					const updatedProfile: Profile = { ...currentProfile, avatar: dataUrl }

					const success = writeKey<Profile>('profile', updatedProfile)

					if (!success) {
						reject(new Error('Failed to save avatar'))
						return
					}

					resolve({ avatarUrl: dataUrl })
				}

				// Handle read error
				reader.onerror = () => {
					reject(new Error('Failed to read file'))
				}

				// Simulate upload progress
				let progress = 0
				const progressInterval = setInterval(() => {
					progress += 10
					if (onProgress) {
						onProgress(Math.min(progress, 100))
					}
					if (progress >= 100) {
						clearInterval(progressInterval)
					}
				}, 100)

				// Start reading file
				reader.readAsDataURL(file)
			})
		},
	},

	// ===========================
	// Preferences API
	// ===========================
	preferences: {
		/**
		 * Get user preferences
		 */
		get: async (): Promise<Preferences> => {
			await delay(200)
			return readKey<Preferences>('preferences', DEFAULT_PREFERENCES)
		},

		/**
		 * Update user preferences
		 */
		update: async (data: Partial<Preferences>): Promise<Preferences> => {
			await delay(400)

			const currentPreferences = readKey<Preferences>('preferences', DEFAULT_PREFERENCES)
			const updatedPreferences: Preferences = { ...currentPreferences, ...data }

			const success = writeKey<Preferences>('preferences', updatedPreferences)

			if (!success) {
				throw new Error('Failed to save preferences to storage')
			}

			return updatedPreferences
		},
	},

	// ===========================
	// Notifications API
	// ===========================
	notifications: {
		/**
		 * Get notification settings
		 */
		get: async (): Promise<Notifications> => {
			await delay(200)
			return readKey<Notifications>('notifications', DEFAULT_NOTIFICATIONS)
		},

		/**
		 * Update notification settings
		 */
		update: async (data: Partial<Notifications>): Promise<Notifications> => {
			await delay(400)

			const currentNotifications = readKey<Notifications>('notifications', DEFAULT_NOTIFICATIONS)
			const updatedNotifications: Notifications = { ...currentNotifications, ...data }

			const success = writeKey<Notifications>('notifications', updatedNotifications)

			if (!success) {
				throw new Error('Failed to save notifications to storage')
			}

			return updatedNotifications
		},
	},

	// ===========================
	// Security API
	// ===========================
	security: {
		/**
		 * Get 2FA status
		 */
		get: async (): Promise<SecurityStatus> => {
			await delay(200)
			return readKey<SecurityStatus>('security', DEFAULT_SECURITY)
		},

		/**
		 * Change password
		 */
		changePassword: async (data: PasswordChangeData): Promise<{ success: boolean }> => {
			// Validate inputs
			if (!data.currentPassword || !data.newPassword) {
				throw new Error('Current password and new password are required')
			}

			if (data.newPassword.length < 8) {
				throw new Error('New password must be at least 8 characters')
			}

			// Get user from localStorage
			const userStr = localStorage.getItem('user')
			const user = userStr ? JSON.parse(userStr) : null

			if (!user?.id) {
				throw new Error('User authentication required')
			}

			// Call real backend API
			const response = await fetch('/authAPI/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: user.id,
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Failed to change password')
			}

			// Update localStorage user if returned
			if (result.user) {
				localStorage.setItem('user', JSON.stringify(result.user))
			}

			return { success: true }
		},

		/**
		 * Enable 2FA
		 */
		enable2FA: async (): Promise<{ success: boolean; qrCode?: string }> => {
			await delay(600)

			// Update security status
			const currentSecurity = readKey<SecurityStatus>('security', DEFAULT_SECURITY)
			const updatedSecurity: SecurityStatus = { ...currentSecurity, twoFactorEnabled: true }

			const success = writeKey<SecurityStatus>('security', updatedSecurity)

			if (!success) {
				throw new Error('Failed to enable 2FA')
			}

			// Generate fake QR code data URL (for demo)
			const qrCode =
				'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5RUiBDb2RlIChEZW1vKTwvdGV4dD48L3N2Zz4='

			return { success: true, qrCode }
		},

		/**
		 * Disable 2FA
		 */
		disable2FA: async (): Promise<{ success: boolean }> => {
			await delay(400)

			// Update security status
			const currentSecurity = readKey<SecurityStatus>('security', DEFAULT_SECURITY)
			const updatedSecurity: SecurityStatus = { ...currentSecurity, twoFactorEnabled: false }

			const success = writeKey<SecurityStatus>('security', updatedSecurity)

			if (!success) {
				throw new Error('Failed to disable 2FA')
			}

			return { success: true }
		},

		/**
		 * Verify 2FA code
		 */
		verify2FA: async (code: string): Promise<{ success: boolean }> => {
			await delay(300)

			// Validate code
			if (!code || code.length !== 6) {
				throw new Error('Invalid verification code. Must be 6 digits.')
			}

			// In demo mode, accept any 6-digit code
			console.log('2FA verification simulated (demo mode)')

			return { success: true }
		},
	},
}

// ===========================
// Utility: Clear all settings
// ===========================

/**
 * Clear all settings (useful for testing/reset)
 */
export const clearAllSettings = (): void => {
	try {
		const keys = ['profile', 'preferences', 'notifications', 'security']
		keys.forEach(key => {
			localStorage.removeItem(STORAGE_PREFIX + key)
		})
		console.log('All settings cleared')
	} catch (error) {
		console.error('Failed to clear settings:', error)
	}
}
