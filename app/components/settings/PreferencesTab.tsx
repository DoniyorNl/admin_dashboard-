'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface PreferencesTabProps {
	preferences: any
	setPreferences: (preferences: any) => void
}

export default function PreferencesTab({ preferences, setPreferences }: PreferencesTabProps) {
	const { theme, setTheme, systemTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	// Theme o'zgarganda preferences'ni ham yangilash
	useEffect(() => {
		if (mounted && theme) {
			setPreferences({ ...preferences, theme })
		}
	}, [theme, mounted])

	if (!mounted) {
		return (
			<div className='space-y-6'>
				<div className='animate-pulse'>
					<div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4'></div>
					<div className='h-10 bg-gray-200 dark:bg-gray-700 rounded'></div>
				</div>
			</div>
		)
	}

	const themeOptions = [
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'system', label: 'System', icon: Monitor },
	]

	const currentTheme = theme || 'system'
	const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

	return (
		<div className='space-y-6'>
			{/* Theme Section */}
			<div>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Appearance</h3>

				<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
					<div>
						<p className='font-medium text-gray-900 dark:text-white'>Theme</p>
						<p className='text-sm text-gray-600 dark:text-gray-400'>
							{isDarkMode ? '🌙 Dark mode' : '☀️ Light mode'}
							{theme === 'system' && ' (system)'}
						</p>
					</div>

					<div className='flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700'>
						{themeOptions.map(option => {
							const Icon = option.icon
							const isSelected = currentTheme === option.value

							return (
								<button
									key={option.value}
									onClick={() => setTheme(option.value)}
									className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
										isSelected
											? 'bg-blue-500 text-white shadow-sm'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
									}`}
									title={option.label}
								>
									<Icon size={18} />
									<span className='text-sm font-medium'>{option.label}</span>
								</button>
							)
						})}
					</div>
				</div>
			</div>

			{/* Language Section */}
			<div>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
					Language & Region
				</h3>

				<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
					<div>
						<p className='font-medium text-gray-900 dark:text-white'>Language</p>
						<p className='text-sm text-gray-600 dark:text-gray-400'>
							Choose your preferred language
						</p>
					</div>

					<select
						value={preferences.language || 'en'}
						onChange={e => setPreferences({ ...preferences, language: e.target.value })}
						className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
					>
						<option value='en'>English</option>
						<option value='uz'>O'zbekcha</option>
						<option value='ru'>Русский</option>
					</select>
				</div>
			</div>

			{/* Timezone Section */}
			<div>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Timezone</h3>

				<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
					<div>
						<p className='font-medium text-gray-900 dark:text-white'>Timezone</p>
						<p className='text-sm text-gray-600 dark:text-gray-400'>Set your local timezone</p>
					</div>

					<select
						value={preferences.timezone || 'UTC+5'}
						onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}
						className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
					>
						<option value='UTC+5'>UTC+5 (Tashkent)</option>
						<option value='UTC+3'>UTC+3 (Moscow)</option>
						<option value='UTC+0'>UTC+0 (London)</option>
						<option value='UTC-5'>UTC-5 (New York)</option>
					</select>
				</div>
			</div>
		</div>
	)
}
