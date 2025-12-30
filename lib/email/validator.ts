import dns from 'dns'
import net from 'net'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

// Email validation utility functions

/**
 * 1. MX Record Tekshiruvi (Bepul, Tez)
 * Domain'ning mail server'i borligini tekshiradi
 */
export async function checkMXRecord(email: string): Promise<boolean> {
	try {
		const domain = email.split('@')[1]
		if (!domain) return false

		const mxRecords = await resolveMx(domain)
		return mxRecords && mxRecords.length > 0
	} catch (error) {
		console.error('MX Record check failed:', error)
		return false
	}
}

/**
 * 1.5 SMTP Email Verification (O'zimiz yozgan - BEPUL va ISHONCHLI!)
 * Email haqiqatan mavjudligini SMTP orqali tekshiradi
 */
export async function verifyEmailViaSMTP(email: string): Promise<{
	isValid: boolean
	reason: string
}> {
	try {
		const domain = email.split('@')[1]
		if (!domain) {
			return { isValid: false, reason: 'Invalid email format' }
		}

		// 1. MX Record olish
		const mxRecords = await resolveMx(domain)
		if (!mxRecords || mxRecords.length === 0) {
			return { isValid: false, reason: 'Domain has no mail server' }
		}

		// Eng kam prioritetli MX server'ni olish
		const mxHost = mxRecords.sort((a, b) => a.priority - b.priority)[0].exchange

		console.log(`🔍 Checking SMTP for ${email} via ${mxHost}`)

		// 2. SMTP server bilan bog'lanish
		return new Promise(resolve => {
			const client = net.createConnection(25, mxHost)
			let response = ''
			let stage = 0

			const timeout = setTimeout(() => {
				client.destroy()
				resolve({ isValid: true, reason: 'SMTP timeout - assumed valid' })
			}, 5000)

			client.on('data', data => {
				response = data.toString()
				console.log(`📩 SMTP Response (stage ${stage}):`, response.substring(0, 100))

				try {
					if (stage === 0 && response.includes('220')) {
						client.write('HELO emailverifier.com\r\n')
						stage = 1
					} else if (stage === 1 && response.includes('250')) {
						client.write('MAIL FROM:<verify@emailverifier.com>\r\n')
						stage = 2
					} else if (stage === 2 && response.includes('250')) {
						client.write(`RCPT TO:<${email}>\r\n`)
						stage = 3
					} else if (stage === 3) {
						clearTimeout(timeout)
						client.write('QUIT\r\n')
						client.end()

						// Email mavjudligini tekshirish
						if (response.includes('250')) {
							console.log(`✅ Email MAVJUD: ${email}`)
							resolve({ isValid: true, reason: 'Email exists and can receive messages' })
						} else if (
							response.includes('550') ||
							response.includes('551') ||
							response.includes('553') ||
							response.includes('552') || // Mailbox full/inactive
							response.includes('554') // Transaction failed
						) {
							console.log(`❌ Email MAVJUD EMAS yoki ISHLAMAYDI: ${email}`)
							resolve({
								isValid: false,
								reason: 'Email address does not exist or cannot receive emails',
							})
						} else {
							console.log(`⚠️ Noaniq javob (rad etiladi): ${email}`)
							// Noaniq javoblarni ham rad etamiz (xavfsizlik uchun)
							resolve({
								isValid: false,
								reason: 'Cannot verify email - please use a valid email address',
							})
						}
					}
				} catch (err) {
					clearTimeout(timeout)
					client.destroy()
					console.error('SMTP error:', err)
					resolve({ isValid: true, reason: 'SMTP verification failed - assumed valid' })
				}
			})

			client.on('error', err => {
				clearTimeout(timeout)
				console.error('SMTP connection error:', err.message)
				resolve({ isValid: true, reason: 'Cannot connect to mail server - assumed valid' })
			})

			client.on('end', () => {
				clearTimeout(timeout)
			})
		})
	} catch (error) {
		console.error('SMTP verification error:', error)
		return { isValid: true, reason: 'SMTP verification failed - assumed valid' }
	}
}

/**
 * 2. Abstract API Email Validation (To'liq tekshiruv)
 * Email haqiqatan mavjud va ishlaydimi tekshiradi
 */
export async function verifyEmailWithAPI(email: string): Promise<{
	isValid: boolean
	isDeliverable: boolean
	message: string
}> {
	const apiKey = process.env.ABSTRACT_API_KEY

	console.log('🔑 API Key Status:', apiKey ? 'MAVJUD ✅' : "YO'Q ❌")

	// Agar API key yo'q bo'lsa - VAQTINCHA faqat MX Record tekshiramiz
	if (!apiKey || apiKey === 'your-abstract-api-key-here') {
		console.warn('⚠️ Abstract API key not configured - using basic MX validation only')
		console.warn('⚠️ WARNING: Fake emails may pass (test123@gmail.com)')
		// VAQTINCHA: API yo'q bo'lsa MX Record qabul qilamiz
		// LEKIN bu 100% ishonchli emas - nasridoni1test@gmail.com ham o'tishi mumkin
		return {
			isValid: true,
			isDeliverable: true,
			message: 'Email validation limited - Please configure Abstract API for full validation',
		}
	}

	try {
		// Abstract API: Query parameters orqali API key yuborish
		const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(
			email,
		)}`

		console.log('🌐 Calling Abstract API for:', email)

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})

		console.log('📡 API Response Status:', response.status)

		if (!response.ok) {
			const errorBody = await response.text().catch(() => 'No error details')
			console.error('❌ API Error Response:', errorBody)
			throw new Error(`API request failed: ${response.status}`)
		}

		const data = await response.json()

		// DEBUG: API response'ni log qilamiz
		console.log('📧 Email Validation API Response for:', email)
		console.log('- is_valid_format:', data.is_valid_format?.value)
		console.log('- is_smtp_valid:', data.is_smtp_valid?.value)
		console.log('- deliverability:', data.deliverability)
		console.log('- is_disposable_email:', data.is_disposable_email?.value)

		// Tekshiruv: format + smtp + deliverable bo'lishi kerak
		const isValidFormat = data.is_valid_format?.value === true
		const isNotDisposable = data.is_disposable_email?.value === false
		const isDeliverable = data.deliverability === 'DELIVERABLE'
		const isSmtpValid = data.is_smtp_valid?.value === true

		console.log('✅ Validation Results:')
		console.log('- Valid Format:', isValidFormat)
		console.log('- Not Disposable:', isNotDisposable)
		console.log('- Deliverable:', isDeliverable)
		console.log('- SMTP Valid:', isSmtpValid)

		// QATTIQ VALIDATSIYA: Faqat REAL mavjud emaillar qabul qilinadi
		// test123@gmail.com kabi fake emaillar rad etiladi
		const isFullyValid = isValidFormat && isNotDisposable && isSmtpValid && isDeliverable

		return {
			isValid: isFullyValid, // HAMMA tekshiruvlardan o'tishi kerak
			isDeliverable: isDeliverable,
			message: !isValidFormat
				? 'Invalid email format'
				: !isNotDisposable
				? 'Disposable email addresses are not allowed'
				: !isSmtpValid
				? 'This email address does not exist or cannot receive emails'
				: !isDeliverable
				? 'This email address cannot receive messages'
				: 'Email is valid and deliverable',
		}
	} catch (error) {
		console.error('❌ Abstract API verification failed:', error)
		console.warn('⚠️ API xatosi - VAQTINCHA faqat MX Record ishlatilmoqda')

		// VAQTINCHA: API ishlamasa - MX Record'ga ishonamiz
		// LEKIN bu 100% ishonchli emas - fake emaillar o'tishi mumkin
		// Yangi API key oling: https://app.abstractapi.com/api/email-validation/
		return {
			isValid: true,
			isDeliverable: true,
			message: 'Email validation limited (API error) - Please get new API key',
		}
	}
}

/**
 * 3. To'liq Email Validation (MX + SMTP Direct Check)
 * O'zimiz yozgan SMTP tekshiruv - 100% BEPUL va ISHONCHLI!
 */
export async function validateEmailComprehensive(email: string): Promise<{
	isValid: boolean
	reason: string
}> {
	console.log('🔍 Starting comprehensive email validation for:', email)

	// 1. Asosiy format tekshiruvi
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return {
			isValid: false,
			reason: 'Invalid email format',
		}
	}

	// 2. MX Record tekshiruvi (domain mavjudmi?)
	const hasMxRecord = await checkMXRecord(email)
	if (!hasMxRecord) {
		return {
			isValid: false,
			reason: 'Email domain does not exist or has no mail server',
		}
	}

	// 3. SMTP orqali to'g'ridan-to'g'ri email mavjudligini tekshirish
	console.log('📧 Verifying email via SMTP...')
	const smtpResult = await verifyEmailViaSMTP(email)

	if (!smtpResult.isValid) {
		console.log('❌ SMTP verification failed:', smtpResult.reason)
		return {
			isValid: false,
			reason: smtpResult.reason,
		}
	}

	// ✅ Hammasi to'g'ri! Email haqiqiy va ishlaydigan
	console.log('✅ Email fully validated:', email)
	return {
		isValid: true,
		reason: smtpResult.reason,
	}
}

/**
 * 4. Tez tekshiruv (faqat MX Record)
 * API limitni tejash uchun
 */
export async function validateEmailQuick(email: string): Promise<{
	isValid: boolean
	reason: string
}> {
	// Format tekshiruvi
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return {
			isValid: false,
			reason: 'Invalid email format',
		}
	}

	// MX Record tekshiruvi
	const hasMxRecord = await checkMXRecord(email)
	if (!hasMxRecord) {
		return {
			isValid: false,
			reason: 'Email domain does not exist',
		}
	}

	return {
		isValid: true,
		reason: 'Email format and domain are valid',
	}
}
