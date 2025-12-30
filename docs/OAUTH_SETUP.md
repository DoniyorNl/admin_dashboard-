# Google & GitHub OAuth sozlash yo'riqnomasi

OAuth authentication endi tayyor! Login va Register sahifalarida Google va GitHub buttonlari qo'shildi.

## 🔧 Kerakli sozlamalar

### 1. Google OAuth sozlash

#### A) Google Cloud Console'ga kiring:

1. Sahifa: https://console.cloud.google.com/
2. Yangi project yarating yoki mavjudini tanlang

#### B) OAuth Credentials yarating:

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Admin Dashboard`

#### C) Authorized redirect URIs qo'shing:

```
http://localhost:3000/api/auth/callback/google
```

Production uchun:

```
https://yourdomain.com/api/auth/callback/google
```

#### D) Client ID va Secret ni oling:

- Google sizga **Client ID** va **Client Secret** beradi
- Bu ma'lumotlarni `.env.local` fayliga qo'shing:

```env
GOOGLE_CLIENT_ID=1234567890-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

---

### 2. GitHub OAuth sozlash

#### A) GitHub Settings'ga kiring:

1. Sahifa: https://github.com/settings/developers
2. **OAuth Apps** → **New OAuth App**

#### B) Application ma'lumotlarini kiriting:

- **Application name**: `Admin Dashboard`
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

#### C) Register application bosing

#### D) Client ID va Secret ni oling:

- **Client ID** ko'rinadi
- **Generate a new client secret** bosing va secret'ni ko'chiring
- Bu ma'lumotlarni `.env.local` fayliga qo'shing:

```env
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456789012345678901234567890abcd
```

---

### 3. NextAuth Secret yarating

Random secret key yarating:

```bash
# Terminal'da ishga tushiring:
openssl rand -base64 32
```

Natijani `.env.local` ga qo'shing:

```env
NEXTAUTH_SECRET=random-generated-secret-key-here
```

---

## ✅ To'liq `.env.local` namunasi:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_API_URL=http://localhost:4000

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-random-string-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=1234567890-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456789012345678901234567890abcd
```

---

## 🚀 Serverni qayta ishga tushiring:

```bash
npm run dev
```

---

## 🎯 Test qiling:

1. **Login sahifa**: http://localhost:3000/login
2. **Register sahifa**: http://localhost:3000/register

Google yoki GitHub button'ni bosing va OAuth orqali kiring!

---

## 📋 Qanday ishlaydi:

1. ✅ Foydalanuvchi "Sign in with Google/GitHub" bosadi
2. ✅ Google/GitHub login sahifasiga o'tadi
3. ✅ Foydalanuvchi ruxsat beradi
4. ✅ Callback URL'ga qaytadi
5. ✅ NextAuth foydalanuvchi ma'lumotlarini oladi
6. ✅ Agar yangi foydalanuvchi bo'lsa - DB'ga qo'shiladi
7. ✅ Dashboard sahifasiga yo'naltiriladi

---

## 🔒 Xavfsizlik:

- ✅ OAuth providers Google/GitHub orqali autentifikatsiya
- ✅ Email avtomatik verified (Google/GitHub tasdiqlagan)
- ✅ Parol saqlash kerak emas (OAuth foydalanuvchilar uchun)
- ✅ Session JWT bilan boshqariladi

---

## 📊 Database struktura:

OAuth orqali kirgan foydalanuvchilar uchun qo'shimcha maydonlar:

```json
{
	"id": 1,
	"email": "user@gmail.com",
	"name": "User Name",
	"password": null,
	"role": "user",
	"provider": "google",
	"providerId": "123456789",
	"image": "https://lh3.googleusercontent.com/...",
	"twoFactorEnabled": false
}
```

---

**Agar credentials olishda yordam kerak bo'lsa - ayting! 🚀**
