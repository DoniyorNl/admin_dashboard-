import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import speakeasy from 'speakeasy'

/**
 * POST /authAPI/2fa/enable
 *
 * Vazifasi:
 * 1. User uchun unique 2FA secret yaratadi (speakeasy)
 * 2. QR code generatsiya qiladi (mobile app scan uchun)
 * 3. Secret va QR code'ni frontend'ga qaytaradi
 *
 * Flow:
 * User "Enable 2FA" toggle'ni bosadi
 *   → Frontend bu endpoint'ga POST qiladi
 *   → Backend secret + QR code yaratadi
 *   → Frontend QR code modal'da ko'rsatadi
 *   → User Google Authenticator/Authy'da scan qiladi
 */
export async function POST(_request: NextRequest) {
	try {
		// 1. Generate secret - bu user uchun unique code
		const secret = speakeasy.generateSecret({
			name: 'Admin Dashboard', // App nomi (authenticator'da ko'rinadi)
			issuer: 'YourCompany', // Company nomi
			length: 32, // Secret uzunligi
		})

		// 2. QR code yaratish - user scan qilishi uchun
		// otpauth://totp/... formatida URL yaratiladi
		const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

		// 3. Frontend'ga secret va QR code qaytarish
		return NextResponse.json({
			success: true,
			secret: secret.base32, // Base32 format (manual entry uchun)
			qrCode, // Data URL format (image src uchun)
		})
	} catch (error) {
		console.error('[2FA Enable] Error:', error)
		return NextResponse.json({ success: false, error: 'Failed to generate 2FA' }, { status: 500 })
	}
}
