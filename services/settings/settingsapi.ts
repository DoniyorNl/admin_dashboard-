// Lightweight local settings API (localStorage-backed) for demo use
// This replaces an external API so the settings components work offline

const STORAGE_PREFIX = 'admindash.settings.'

function readKey(key: string, fallback: any) {
	try {
		const raw = localStorage.getItem(STORAGE_PREFIX + key)
		return raw ? JSON.parse(raw) : fallback
	} catch (e) {
		console.warn('readKey error', e)
		return fallback
	}
}

function writeKey(key: string, value: any) {
	try {
		localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
		return true
	} catch (e) {
		console.warn('writeKey error', e)
		return false
	}
}

const defaultProfile = {
	firstName: 'John',
	lastName: 'Doe',
	email: 'john.doe@example.com',
	phone: '+1 234 567 8900',
	role: 'Admin',
	bio: 'E-commerce platform administrator',
	avatar: null,
}

const defaultPreferences = {
	theme: 'light',
	language: 'en',
	currency: 'USD',
	timezone: 'UTC',
}

const defaultNotifications = {
	emailOrders: true,
	emailCustomers: true,
	emailProducts: false,
	systemAlerts: true,
	systemUpdates: false,
	weeklyReports: true,
}

export const settingsApi = {
	profile: {
		get: async () => {
			return readKey('profile', defaultProfile)
		},
		update: async (data: any) => {
			writeKey('profile', data)
			return data
		},
		uploadAvatar: async (file: File, onProgress?: (p: number) => void) => {
			// read file as data URL and simulate progress
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = () => {
					const dataUrl = reader.result
					writeKey('profile', { ...readKey('profile', defaultProfile), avatar: dataUrl })
					resolve({ avatarUrl: dataUrl })
				}
				reader.onerror = err => reject(err)

				let progress = 0
				const timer = setInterval(() => {
					progress += 20
					if (onProgress) onProgress(progress)
					if (progress >= 100) clearInterval(timer)
				}, 120)

				reader.readAsDataURL(file)
			})
		},
	},

	preferences: {
		get: async () => readKey('preferences', defaultPreferences),
		update: async (data: any) => {
			writeKey('preferences', data)
			return data
		},
	},

	notifications: {
		get: async () => readKey('notifications', defaultNotifications),
		update: async (data: any) => {
			writeKey('notifications', data)
			return data
		},
	},

	security: {
		changePassword: async (data: any) => {
			// In demo mode we just succeed
			return { success: true }
		},
		enable2FA: async () => ({ success: true }),
		disable2FA: async () => ({ success: true }),
		verify2FA: async (code: string) => ({ success: true }),
	},
}
