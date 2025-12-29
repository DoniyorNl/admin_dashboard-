export function validateRequired(value: any, fieldName = 'Field') {
	if (!value || (typeof value === 'string' && !value.trim())) return `${fieldName} is required`
	return ''
}

export function validateEmail(email: string) {
	if (!email) return 'Email is required'
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
	return re.test(email) ? '' : 'Invalid email address'
}

export function validatePhone(phone: string) {
	if (!phone) return 'Phone is required'
	const re = /^[0-9+\-()\s]{6,20}$/
	return re.test(phone) ? '' : 'Invalid phone number'
}

export function validateFileSize(file: File, maxMb = 2) {
	const maxBytes = maxMb * 1024 * 1024
	if (file.size > maxBytes) return `File must be smaller than ${maxMb}MB`
	return ''
}

export function validateFileType(file: File, allowed: string[] = []) {
	if (allowed.length === 0) return ''
	return allowed.includes(file.type) ? '' : 'Invalid file type'
}

export function validatePassword(password: string) {
	if (!password) return 'Password is required'
	if (password.length < 8) return 'Password must be at least 8 characters'
	return ''
}

export function validatePasswordMatch(pw: string, confirm: string) {
	if (!confirm) return 'Please confirm password'
	return pw === confirm ? '' : 'Passwords do not match'
}
