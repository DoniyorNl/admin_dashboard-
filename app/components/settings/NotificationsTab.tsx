import React from 'react'

import type { Notifications } from '@/hooks/useSettings'

interface NotificationsTabProps {
	notifications: Notifications
	setNotifications: React.Dispatch<React.SetStateAction<Notifications>>
}

export default function NotificationsTab({
	notifications,
	setNotifications,
}: NotificationsTabProps) {
	const handleToggle = (field: keyof Notifications) => {
		setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
	}

	const ToggleSwitch = ({
		checked,
		onChange,
		label,
		description,
	}: {
		checked: boolean
		onChange: () => void
		label: string
		description: string
	}) => (
		<div className='flex items-center justify-between py-3'>
			<div className='flex-1'>
				<p className='font-medium text-gray-700 dark:text-gray-200'>{label}</p>
				<p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
			</div>
			<label className='relative inline-flex items-center cursor-pointer ml-4'>
				<input type='checkbox' checked={checked} onChange={onChange} className='sr-only peer' />
				<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
			</label>
		</div>
	)

	const emailNotifications: Array<{
		key: keyof Notifications
		label: string
		description: string
	}> = [
		{
			key: 'emailOrders',
			label: 'New Orders',
			description: 'Get notified when new orders are placed',
		},
		{
			key: 'emailCustomers',
			label: 'New Customers',
			description: 'Get notified when new customers register',
		},
		{
			key: 'emailProducts',
			label: 'Product Updates',
			description: 'Get notified about product inventory changes',
		},
	]

	const systemNotifications: Array<{
		key: keyof Notifications
		label: string
		description: string
	}> = [
		{
			key: 'systemAlerts',
			label: 'System Alerts',
			description: 'Critical system alerts and warnings',
		},
		{
			key: 'systemUpdates',
			label: 'System Updates',
			description: 'Updates about new features and improvements',
		},
		{
			key: 'weeklyReports',
			label: 'Weekly Reports',
			description: 'Receive weekly performance reports',
		},
	]

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
					Notification Preferences
				</h2>

				<div className='space-y-6'>
					{/* Email Notifications */}
					<div className='border-b border-gray-200 dark:border-gray-700 pb-6'>
						<h3 className='font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
							<span className='w-2 h-2 bg-blue-500 rounded-full'></span>
							Email Notifications
						</h3>
						<div className='space-y-1'>
							{emailNotifications.map(item => (
								<ToggleSwitch
									key={item.key}
									checked={notifications[item.key]}
									onChange={() => handleToggle(item.key)}
									label={item.label}
									description={item.description}
								/>
							))}
						</div>
					</div>

					{/* System Notifications */}
					<div>
						<h3 className='font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
							<span className='w-2 h-2 bg-green-500 rounded-full'></span>
							System Notifications
						</h3>
						<div className='space-y-1'>
							{systemNotifications.map(item => (
								<ToggleSwitch
									key={item.key}
									checked={notifications[item.key]}
									onChange={() => handleToggle(item.key)}
									label={item.label}
									description={item.description}
								/>
							))}
						</div>
					</div>

					{/* Info Box */}
					<div className='mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg'>
						<p className='text-sm text-amber-800 dark:text-amber-200'>
							<strong>Note:</strong> You can always change these settings later. Critical security
							alerts will always be sent regardless of your preferences.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
