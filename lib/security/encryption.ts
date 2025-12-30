/**
 * Encryption utility for sensitive data (2FA secrets, tokens, etc.)
 * Uses AES-256-GCM for authenticated encryption
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const KEY_LENGTH = 32

/**
 * Get encryption key from environment
 * In production, this should be stored securely (AWS Secrets Manager, Vault, etc.)
 */
function getEncryptionKey(): Buffer {
	const secret = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET

	if (!secret) {
		throw new Error('ENCRYPTION_SECRET or JWT_SECRET must be set in environment')
	}

	// Derive a key from the secret using PBKDF2
	return crypto.pbkdf2Sync(secret, 'salt', 100000, KEY_LENGTH, 'sha256')
}

/**
 * Encrypt sensitive data
 * Returns: base64-encoded string with format: salt.iv.tag.encryptedData
 */
export function encrypt(text: string): string {
	try {
		const key = getEncryptionKey()
		const iv = crypto.randomBytes(IV_LENGTH)
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

		let encrypted = cipher.update(text, 'utf8', 'hex')
		encrypted += cipher.final('hex')

		const tag = cipher.getAuthTag()

		// Combine: iv.tag.encrypted (all in hex)
		const combined = `${iv.toString('hex')}.${tag.toString('hex')}.${encrypted}`

		return Buffer.from(combined).toString('base64')
	} catch (error) {
		console.error('[Encryption] Error:', error)
		throw new Error('Failed to encrypt data')
	}
}

/**
 * Decrypt encrypted data
 */
export function decrypt(encryptedData: string): string {
	try {
		const key = getEncryptionKey()
		const combined = Buffer.from(encryptedData, 'base64').toString('utf8')
		const parts = combined.split('.')

		if (parts.length !== 3) {
			throw new Error('Invalid encrypted data format')
		}

		const iv = Buffer.from(parts[0], 'hex')
		const tag = Buffer.from(parts[1], 'hex')
		const encrypted = parts[2]

		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
		decipher.setAuthTag(tag)

		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')

		return decrypted
	} catch (error) {
		console.error('[Decryption] Error:', error)
		throw new Error('Failed to decrypt data')
	}
}

/**
 * Hash a password or sensitive string (one-way)
 */
export function hash(text: string): string {
	return crypto.createHash('sha256').update(text).digest('hex')
}

/**
 * Verify a hash
 */
export function verifyHash(text: string, hashedText: string): boolean {
	return hash(text) === hashedText
}
