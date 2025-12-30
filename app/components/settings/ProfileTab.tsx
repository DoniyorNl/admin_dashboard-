// settings/ProfileTab.tsx
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
	onSave: () => Promise<void> // ✅ Yangi prop
	saving: boolean
}

interface ProfileErrors {
	firstName?: string
	lastName?: string
	email?: string
	phone?: string
}

export default function ProfileTab({
	profile,
	setProfile,
	uploadAvatar,
	onSave,
	saving,
}: ProfileTabProps) {
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

	// ✅ Validatsiya funksiyasi - endi ishlatiladi!
	const validateForm = (): boolean => {
		const newErrors: ProfileErrors = {}

		newErrors.firstName = validateRequired(profile.firstName, 'First name')
		newErrors.lastName = validateRequired(profile.lastName, 'Last name')
		newErrors.email = validateEmail(profile.email)
		newErrors.phone = validatePhone(profile.phone)

		// Faqat xatolar mavjud bo'lsa setErrors chaqirish
		const hasErrors = Object.values(newErrors).some(error => error !== '')

		if (hasErrors) {
			setErrors(newErrors)
		}

		return !hasErrors
	}

	// ✅ Submit handler - validatsiya bilan
	const handleSubmit = async () => {
		// Validatsiya qilish
		if (!validateForm()) {
			// Scroll to first error (optional)
			const firstErrorField = Object.keys(errors)[0]
			if (firstErrorField) {
				const element = document.querySelector(`[name="${firstErrorField}"]`)
				element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
			return
		}

		// Parent funksiyasini chaqirish
		await onSave()
	}

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file
		const sizeError = validateFileSize(file, 2)
		const typeError = validateFileType(file, ['image/jpeg', 'image/png', 'image/gif'])

		if (sizeError || typeError) {
			// ✅ alert o'rniga better error handling
			const errorMessage = sizeError || typeError
			console.error('File validation error:', errorMessage)
			// Toast notification ko'rsatish uchun parent ga yuborish mumkin
			alert(errorMessage)
			return
		}

		setUploading(true)
		setUploadProgress(0)

		try {
			const result = await uploadAvatar(file, progress => {
				setUploadProgress(progress)
			})

			if (!result.success) {
				alert(result.error || 'Failed to upload avatar')
			}
		} catch (error) {
			console.error('Avatar upload error:', error)
			alert('An unexpected error occurred while uploading')
		} finally {
			setUploading(false)
			setUploadProgress(0)
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
							aria-label='Upload avatar'
						/>
						<Button
							variant='secondary'
							size='sm'
							onClick={() => fileInputRef.current?.click()}
							loading={uploading}
							disabled={uploading || saving}
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
						name='firstName'
						value={profile.firstName}
						onChange={e => handleChange('firstName', e.target.value)}
						error={errors.firstName}
						placeholder='Enter first name'
						disabled={saving}
						required
					/>

					<Input
						label='Last Name'
						name='lastName'
						value={profile.lastName}
						onChange={e => handleChange('lastName', e.target.value)}
						error={errors.lastName}
						placeholder='Enter last name'
						disabled={saving}
						required
					/>

					<Input
						label='Email'
						name='email'
						type='email'
						value={profile.email}
						onChange={e => handleChange('email', e.target.value)}
						error={errors.email}
						placeholder='Enter email'
						disabled={saving}
						required
					/>

					<Input
						label='Phone'
						name='phone'
						type='tel'
						value={profile.phone}
						onChange={e => handleChange('phone', e.target.value)}
						error={errors.phone}
						placeholder='+1 234 567 8900'
						disabled={saving}
						required
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
						disabled={saving}
						className='w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-slate-400 dark:placeholder-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
					/>
				</div>
			</div>

			{/* ✅ Save Button - ProfileTab ichida */}
			<div className='flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700'>
				<Button
					variant='primary'
					onClick={handleSubmit}
					loading={saving}
					disabled={saving || uploading}
				>
					Save Changes
				</Button>
			</div>
		</div>
	)
}
