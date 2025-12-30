# 🔐 2FA Production Security - Implementation Guide

## ✅ Implemented Security Improvements

### 1. **Encryption System** (`lib/security/encryption.ts`)

- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Features**:
  - Encrypt/decrypt 2FA secrets before DB storage
  - Tamper-proof (authentication tag)
  - Base64 encoding for DB storage

### 2. **Rate Limiting** (`lib/security/rateLimit.ts`)

- **2FA Verification**: 5 attempts per 15 minutes → 30 min block
- **Login**: 10 attempts per 15 minutes → 15 min block
- **2FA Enable**: 3 attempts per hour → 1 hour block
- **Features**:
  - In-memory storage (use Redis in production)
  - Automatic cleanup of expired entries
  - Returns remaining attempts and retry-after time

### 3. **Database Integration**

#### Enable Route (`app/authAPI/2fa/enable/route.ts`)

✅ Now saves to database:

```typescript
PATCH /users/:userId
{
  "twoFactorSecret": "<encrypted_secret>",
  "twoFactorEnabled": false  // Set to true after verification
}
```

#### Disable Route (`app/authAPI/2fa/disable/route.ts`)

✅ Now updates database:

```typescript
PATCH /users/:userId
{
  "twoFactorSecret": null,
  "twoFactorEnabled": false
}
```

#### Verify Route (`app/authAPI/2fa/verify/route.ts`)

✅ Enhanced security:

- Decrypts secret from DB
- Rate limiting (5 attempts/15min)
- Auto-enables 2FA after first successful verification
- Resets rate limit on success

### 4. **Frontend Integration**

- Updated `useSettings.ts` hook to call real backend endpoints
- Enhanced `SecurityTab.tsx` with error handling and loading states
- User ID fetched from localStorage/auth context

---

## 🚀 Production Deployment Checklist

### 1. Environment Variables

Create `.env.production`:

```bash
# CRITICAL: Generate strong secrets (32+ characters)
JWT_SECRET="your-production-jwt-secret-min-32-chars-random"
ENCRYPTION_SECRET="your-production-encryption-secret-different-from-jwt"

# Database
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AUTH_API_URL=https://api.yourdomain.com
```

**Generate secrets:**

```bash
# On Linux/Mac
openssl rand -base64 32

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Database Migration

Add columns to `users` table:

```sql
-- If using PostgreSQL/MySQL
ALTER TABLE users
ADD COLUMN twoFactorSecret TEXT,
ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT FALSE;

-- If using json-server (update db.json)
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "twoFactorSecret": null,
      "twoFactorEnabled": false
    }
  ]
}
```

### 3. Rate Limiting - Switch to Redis

**Install Redis:**

```bash
npm install ioredis
```

**Update `lib/security/rateLimit.ts`:**

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function checkRateLimit(identifier: string, config: RateLimitConfig) {
	const key = `ratelimit:${identifier}`
	const now = Date.now()

	// Use Redis INCR with expiry
	const count = await redis.incr(key)

	if (count === 1) {
		await redis.pexpire(key, config.windowMs)
	}

	if (count > config.maxAttempts) {
		const ttl = await redis.pttl(key)
		return {
			allowed: false,
			remaining: 0,
			retryAfter: Math.ceil(ttl / 1000),
		}
	}

	return {
		allowed: true,
		remaining: config.maxAttempts - count,
	}
}
```

### 4. Monitoring & Logging

**Add structured logging:**

```typescript
// lib/logger.ts
export const securityLogger = {
	log2FAEnable: (userId: number) => {
		console.log(
			JSON.stringify({
				event: '2fa_enabled',
				userId,
				timestamp: new Date().toISOString(),
			}),
		)
	},

	log2FAVerifyFailed: (userId: number, ip: string) => {
		console.warn(
			JSON.stringify({
				event: '2fa_verify_failed',
				userId,
				ip,
				timestamp: new Date().toISOString(),
			}),
		)
	},
}
```

### 5. IP-based Rate Limiting

Add IP detection:

```typescript
// lib/security/getClientIP.ts
import { NextRequest } from 'next/server'

export function getClientIP(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0] ||
		request.headers.get('x-real-ip') ||
		'unknown'
	)
}

// In verify route:
const ip = getClientIP(request)
const rateLimitKey = `2fa-verify:${userId}:${ip}`
```

### 6. Security Headers

Add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/authAPI/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ]
}
```

### 7. Backup Codes (Recommended)

Generate recovery codes when enabling 2FA:

```typescript
// lib/security/backupCodes.ts
import crypto from 'crypto'
import { hash } from './encryption'

export function generateBackupCodes(count = 8): string[] {
	return Array.from({ length: count }, () => crypto.randomBytes(4).toString('hex').toUpperCase())
}

export function hashBackupCodes(codes: string[]): string[] {
	return codes.map(hash)
}
```

---

## 🧪 Testing

### Test Rate Limiting:

```bash
# Try 6 times rapidly (should block after 5th)
for i in {1..6}; do
  curl -X POST http://localhost:3000/authAPI/2fa/verify \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"code":"000000"}'
  echo ""
done
```

### Test Encryption:

```typescript
// test/encryption.test.ts
import { encrypt, decrypt } from '@/lib/security/encryption'

test('encrypt and decrypt', () => {
	const secret = 'JBSWY3DPEHPK3PXP'
	const encrypted = encrypt(secret)
	const decrypted = decrypt(encrypted)
	expect(decrypted).toBe(secret)
})
```

---

## 📊 Monitoring Metrics

Track these in production:

1. **2FA Adoption Rate**: % of users with 2FA enabled
2. **Failed Verification Attempts**: Spike = brute force attack
3. **Rate Limit Triggers**: Monitor for abuse patterns
4. **Average Setup Time**: UX metric

---

## 🔄 Migration Guide

If you have existing users:

1. **Announcement**: Email users about 2FA availability
2. **Soft Launch**: Make 2FA optional first
3. **Grace Period**: 90 days before making it mandatory
4. **Support**: Provide recovery process documentation

---

## ⚠️ Known Limitations

1. **In-memory rate limiting**: Use Redis for multi-server deployments
2. **No backup codes**: Add recovery codes for lost devices
3. **Cookie-based auth**: Consider JWT for better scalability
4. **No audit log**: Add security event logging

---

## 📚 Additional Resources

- [OWASP 2FA Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [Speakeasy Library Docs](https://github.com/speakeasyjs/speakeasy)

---

## 🎯 Next Steps

1. ✅ Test in staging environment
2. ✅ Set up Redis for production
3. ✅ Add backup codes feature
4. ✅ Implement audit logging
5. ✅ Configure monitoring alerts
6. ✅ Write user documentation
