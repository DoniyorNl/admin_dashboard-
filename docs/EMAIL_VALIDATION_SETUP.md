# 🔍 Email Validation Setup - MX Record + Abstract API

## 🎯 Endi Qanday Ishlaydi?

Emailni **3 bosqichda** tekshiradi:

```
1. ✅ Format tekshiruvi     → test@gmail.com
2. ✅ MX Record tekshiruvi  → gmail.com mail server bormi?
3. ✅ Abstract API          → Email haqiqatan ishlaydimi?
```

---

## 🚀 SOZLASH (5 daqiqa)

### 1️⃣ Abstract API Account Yaratish (BEPUL)

#### A) Website'ga kiring:

```
https://app.abstractapi.com/api/email-validation/
```

#### B) Sign Up qiling:

- **Email** kiriting (Google bilan ham bo'ladi)
- **Password** yarating
- Account tasdiqlang

#### C) API Key oling:

1. Dashboard'da **"Email Validation"** ni toping
2. **"Your API Key"** ko'rsatiladi
3. **Copy** qiling (masalan: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

#### D) Free Tier:

- ✅ **100 ta request/oy** - BEPUL
- ✅ Credit card KERAK EMAS
- ✅ Barcha xususiyatlar mavjud

---

### 2️⃣ .env.local Faylini To'ldiring

Fayl oching: `.env.local`

Qo'shing:

```env
# Abstract API Key (Bepul 100/oy)
ABSTRACT_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**To'liq namuna:**

```env
# Email Service
SMTP_USER=nasridoninl@gmail.com
SMTP_PASSWORD=abcdefghijklmnop

# Email Verification
ABSTRACT_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

Save qiling: `Ctrl+S` / `Cmd+S`

---

### 3️⃣ Server Restart

```bash
# Terminal'da Ctrl+C
# Keyin:
npm run dev:all
```

---

## 🧪 TEST QILISH

### ✅ TEST 1: To'g'ri Email

```
nasridoninl@gmail.com  → ✅ Hammasi OK
```

### ❌ TEST 2: Fake Domain

```
test@fakefakedomain123.com  → ❌ "Email domain does not exist"
```

### ❌ TEST 3: Format Xato

```
testtest  → ❌ "Invalid email format"
```

### ❌ TEST 4: Fake Email (Real Domain)

```
qwertyuiop123456789@gmail.com  → ❌ "Email address exists but may not receive emails"
```

---

## 📊 Qanday Ishlaydi?

### **1. MX Record (Tez, Bepul)**

```javascript
test@gmail.com
  ↓
gmail.com mail server bormi?
  ↓
✅ Ha, gmail.com MX record bor
```

### **2. Abstract API (To'liq)**

```javascript
qwertyuiop123456789@gmail.com
  ↓
Bu email haqiqatan ishlayaptimi?
  ↓
❌ Yo'q, bu email mavjud emas
```

---

## 🔧 Sozlamalar

### API Key bo'lmasa?

Agar `ABSTRACT_API_KEY` yo'q bo'lsa:

- ✅ MX Record ishlab turadi (domain tekshiruvi)
- ❌ To'liq email tekshiruvi o'tkazib yuboriladi
- ⚠️ Warning log'da ko'rinadi

### Limit tugasa?

- Bepul: 100/oy
- Agar tugasa → faqat MX Record ishlatiladi
- Yoki yangi account yarating (yana 100 ta)

---

## 📂 Yaratilgan Fayllar

1. ✅ **lib/email/validator.ts** - Email validation utility
2. ✅ **docs/EMAIL_VALIDATION_SETUP.md** - Bu yo'riqnoma

## 📝 O'zgargan Fayllar

1. ✅ **app/authAPI/forgot-password/route.ts** - Validation qo'shildi
2. ✅ **.env.local** - API key qo'shildi
3. ✅ **.env.example** - Namuna yangilandi

---

## 💡 Abstract API Nima Tekshiradi?

```json
{
	"email": "test@gmail.com",
	"is_valid_format": true, // Format to'g'rimi?
	"is_mx_found": true, // MX record bormi?
	"is_smtp_valid": true, // SMTP server javob beradimi?
	"is_disposable_email": false, // Temp email emasmikan? (10minutemail)
	"deliverability": "DELIVERABLE", // Email qabul qiladimi?
	"quality_score": 0.99 // Email sifati (0-1)
}
```

---

## 🎯 Afzalliklar

### **MX Record:**

- ⚡ Juda tez (10-50ms)
- 💰 100% bepul
- ✅ Domain mavjudligini tekshiradi

### **Abstract API:**

- 🎯 Email haqiqatan ishlaydimi?
- 🚫 Fake/disposable email'larni bloklaydi
- 📊 Email sifatini baholaydi
- 💯 99% aniqlik

### **Ikkalasi Birgalikda:**

- 🔒 Eng kuchli himoya
- 🎭 Fake account yaratishni oldini oladi
- ✅ Faqat real email'larni qabul qiladi

---

## ❓ FAQ

### Q: API key qayerdan topaman?

**A:** https://app.abstractapi.com/api/email-validation/

### Q: Pul to'lash kerakmi?

**A:** Yo'q! 100 ta/oy bepul, credit card kerak emas.

### Q: 100 ta yetmasa?

**A:** Yangi account yaratish (boshqa email) yoki $9/oy to'lash (5000 ta)

### Q: API ishlamasa?

**A:** MX Record baribir ishlaydi. API faqat qo'shimcha tekshiruv.

---

## 🆘 Yordam

Agar muammo bo'lsa:

1. `.env.local` da API key to'g'riligini tekshiring
2. Server restart qildingizmi?
3. Abstract API dashboard'da request count'ni tekshiring

🚀 **Happy Coding!**
