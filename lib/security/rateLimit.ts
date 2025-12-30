/**
 * Rate Limiting utility for preventing brute force attacks
 * Uses in-memory storage (for production, use Redis)
 */

interface RateLimitEntry {
	count: number
	resetAt: number
	blockedUntil?: number
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
	windowMs: number // Time window in milliseconds
	maxAttempts: number // Max attempts per window
	blockDurationMs?: number // How long to block after exceeding limit
}

/**
 * Default configs for different endpoints
 */
export const RATE_LIMITS = {
	// 2FA verification: 5 attempts per 15 minutes
	TFA_VERIFY: {
		windowMs: 15 * 60 * 1000,
		maxAttempts: 5,
		blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes
	},
	// Login: 10 attempts per 15 minutes
	LOGIN: {
		windowMs: 15 * 60 * 1000,
		maxAttempts: 10,
		blockDurationMs: 15 * 60 * 1000,
	},
	// 2FA enable: 3 attempts per hour
	TFA_ENABLE: {
		windowMs: 60 * 60 * 1000,
		maxAttempts: 3,
		blockDurationMs: 60 * 60 * 1000,
	},
}

/**
 * Check if request is rate limited
 * Returns: { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
	identifier: string,
	config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetAt: number; retryAfter?: number } {
	const key = `ratelimit:${identifier}`
	const now = Date.now()

	let entry = rateLimitStore.get(key)

	// Check if blocked
	if (entry?.blockedUntil && entry.blockedUntil > now) {
		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.blockedUntil,
			retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
		}
	}

	// Reset if window expired
	if (!entry || entry.resetAt <= now) {
		entry = {
			count: 1,
			resetAt: now + config.windowMs,
		}
		rateLimitStore.set(key, entry)

		return {
			allowed: true,
			remaining: config.maxAttempts - 1,
			resetAt: entry.resetAt,
		}
	}

	// Increment count
	entry.count++

	// Check if exceeded
	if (entry.count > config.maxAttempts) {
		entry.blockedUntil = now + (config.blockDurationMs || config.windowMs)
		rateLimitStore.set(key, entry)

		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.blockedUntil,
			retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
		}
	}

	rateLimitStore.set(key, entry)

	return {
		allowed: true,
		remaining: config.maxAttempts - entry.count,
		resetAt: entry.resetAt,
	}
}

/**
 * Reset rate limit for a specific identifier (useful after successful action)
 */
export function resetRateLimit(identifier: string): void {
	const key = `ratelimit:${identifier}`
	rateLimitStore.delete(key)
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupRateLimits(): void {
	const now = Date.now()
	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.resetAt <= now && (!entry.blockedUntil || entry.blockedUntil <= now)) {
			rateLimitStore.delete(key)
		}
	}
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
	setInterval(cleanupRateLimits, 5 * 60 * 1000)
}
