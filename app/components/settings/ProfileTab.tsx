import { Camera } from 'lucide-react'
import React, { useRef, useState } from 'react'
import {
	validateEmail,
	validateFileSize,
	validateFileType,
	validatePhone,
	validateRequired,
} from '../../utils/validation'
import Badge from '../UI/Badge'
import Button from '../UI/Button'
import Input from '../UI/Input'

interface ProfileTabProps {
	profile: {
		firstName: string
		lastName: string
		email: string
		phone: string
		role: string
		bio: string
		avatar: string | null
	}
	setProfile: React.Dispatch<React.SetStateAction<ProfileTabProps['profile']>>
	uploadAvatar: (
		file: File,
		onProgress: (progress: number) => void,
	) => Promise<{ success: boolean; error?: string }>
	saving: boolean
}

interface ProfileErrors {
	firstName?: string
	lastName?: string
	email?: string
	phone?: string
}

export default function ProfileTab({ profile, setProfile, uploadAvatar, saving }: ProfileTabProps) {
	const [errors, setErrors] = useState<ProfileErrors>({})
	const [uploadProgress, setUploadProgress] = useState(0)
	const [uploading, setUploading] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleChange = (field: keyof ProfileTabProps['profile'], value: string) => {
		setProfile(prev => ({ ...prev, [field]: value }))

		// Clear error when user starts typing
		if (errors[field as keyof ProfileErrors]) {
			setErrors(prev => ({ ...prev, [field]: '' }))
		}
	}

	const validateForm = () => {
		const newErrors: ProfileErrors = {}

		newErrors.firstName = validateRequired(profile.firstName, 'First name')
		newErrors.lastName = validateRequired(profile.lastName, 'Last name')
		newErrors.email = validateEmail(profile.email)
		newErrors.phone = validatePhone(profile.phone)

		setErrors(newErrors)
		return !Object.values(newErrors).some(error => error !== '')
	}

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file
		const sizeError = validateFileSize(file, 2)
		const typeError = validateFileType(file, ['image/jpeg', 'image/png', 'image/gif'])

		if (sizeError || typeError) {
			alert(sizeError || typeError)
			return
		}

		setUploading(true)
		setUploadProgress(0)

		const result = await uploadAvatar(file, progress => {
			setUploadProgress(progress)
		})

		setUploading(false)
		setUploadProgress(0)

		if (result.success) {
			// Avatar updated successfully
		} else {
			alert(result.error)
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
					Profile Information
				</h2>

				{/* Avatar Upload */}
				<div className='flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'>
					<div className='relative'>
						{profile.avatar ? (
							<img
								src={profile.avatar}
								alt='Avatar'
								className='w-20 h-20 rounded-full object-cover'
							/>
						) : (
							<div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
								{profile.firstName?.[0]}
								{profile.lastName?.[0]}
							</div>
						)}
						{uploading && (
							<div className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center'>
								<span className='text-white text-sm font-bold'>{Math.round(uploadProgress)}%</span>
							</div>
						)}
					</div>

					<div>
						<input
							ref={fileInputRef}
							type='file'
							accept='image/jpeg,image/png,image/gif'
							onChange={handleFileSelect}
							className='hidden'
						/>
						<Button
							variant='secondary'
							size='sm'
							onClick={() => fileInputRef.current?.click()}
							loading={uploading}
							icon={<Camera size={18} />}
						>
							Change Photo
						</Button>
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
							JPG, PNG or GIF. Max 2MB
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<Input
						label='First Name'
						value={profile.firstName}
						onChange={e => handleChange('firstName', e.target.value)}
						error={errors.firstName}
						placeholder='Enter first name'
					/>

					<Input
						label='Last Name'
						value={profile.lastName}
						onChange={e => handleChange('lastName', e.target.value)}
						error={errors.lastName}
						placeholder='Enter last name'
					/>

					<Input
						label='Email'
						type='email'
						value={profile.email}
						onChange={e => handleChange('email', e.target.value)}
						error={errors.email}
						placeholder='Enter email'
					/>

					<Input
						label='Phone'
						type='tel'
						value={profile.phone}
						onChange={e => handleChange('phone', e.target.value)}
						error={errors.phone}
						placeholder='+1 234 567 8900'
					/>

					<div className='flex flex-col'>
						<label className='text-sm font-medium mb-1 text-slate-700 dark:text-slate-300'>
							Role
						</label>
						<div className='py-2'>
							<Badge color='blue'>{profile.role}</Badge>
						</div>
					</div>
				</div>

				<div className='mt-4'>
					<label className='text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1'>
						Bio
					</label>
					<textarea
						value={profile.bio}
						onChange={e => handleChange('bio', e.target.value)}
						rows={3}
						placeholder='Tell us about yourself'
						className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-slate-400 dark:placeholder-slate-500 transition-all'
					/>
				</div>
			</div>
		</div>
	)
}
