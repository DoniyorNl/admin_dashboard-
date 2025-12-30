# 📧 Gmail SMTP Sozlash - Forgot Password Email Yuborish

## 📝 Qisqacha Tushuntirish

Endi **Forgot Password** funksiyasi haqiqiy emailga parol yuboradi. Gmail SMTP orqali email yuboriladi.

---

## 🚀 Sozlash Qadamlari

### 1. Gmail App Password Olish

Gmail **oddiy parolini** ishlatib bo'lmaydi. Maxsus **App Password** kerak.

#### ✅ App Password Qanday Olish Kerak:

1. **Google Account ga kiring:** https://myaccount.google.com/
2. **Security** bo'limiga o'ting
3. **"2-Step Verification"** yoqilgan bo'lishi kerak (agar yo'q bo'lsa - yoqing)
4. **"App passwords"** ni toping va oching: https://myaccount.google.com/apppasswords
5. **"Select app"** → **Mail** ni tanlang
6. **"Select device"** → **Other (Custom name)** → **"Admin Dashboard"** deb nomlang
7. **Generate** tugmasini bosing
8. **16 belgili parol** paydo bo'ladi (masalan: `abcd efgh ijkl mnop`)
9. Bu parolni **nusxalab oling** (faqat 1 marta ko'rsatiladi!)

---

### 2. .env.local Faylini Sozlash

`.env.local` faylini oching va quyidagilarni to'ldiring:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sizning-emailingiz@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM_NAME=Admin Dashboard
```

**Misol:**

```env
SMTP_USER=nasridoninl@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

> ⚠️ **Muhim:** `SMTP_PASSWORD` - bu sizning oddiy Gmail parolingiz EMAS! Bu App Password!

---

### 3. Serverni Qayta Ishga Tushirish

`.env.local` o'zgartirilgandan keyin, serverlarni to'xtatib, qayta ishga tushiring:

```bash
# Ctrl+C bilan to'xtating
npm run dev

# Qayta ishga tushiring
npm run dev
```

---

## 🧪 Test Qilish

### 1. Forgot Password Sahifasiga O'ting

```
http://localhost:3000/forgot-password
```

### 2. Email Kiriting

Database'da mavjud emailni kiriting (masalan: `nasridoninl@gmail.com`)

### 3. "Reset Password" Tugmasini Bosing

### 4. Emailni Tekshiring

- ✅ Gmail inbox'ingizga email keladi (1-2 daqiqada)
- ✅ Email chiroyli HTML formatda keladi
- ✅ Parol email ichida ko'rsatiladi

### 5. Yangi Parol Bilan Kiring

- ✅ Emaildan parolni nusxalang
- ✅ Login sahifasida kiriting
- ✅ Settings → Security → Parolni o'zgartiring

---

## 📂 Yaratilgan/O'zgartirilgan Fayllar

### Yangi Fayllar:

1. ✅ **lib/email/mailer.ts** - Email yuborish funksiyasi
2. ✅ **docs/EMAIL_SETUP.md** - Bu fayl (yo'riqnoma)

### O'zgartirilgan Fayllar:

1. ✅ **app/authAPI/forgot-password/route.ts** - Email yuborish qo'shildi
2. ✅ **app/(auth)/forgot-password/page.tsx** - UI yangilandi (parol ekranda ko'rsatilmaydi)
3. ✅ **.env.local** - Email konfiguratsiya qo'shildi
4. ✅ **.env.example** - Email sozlamalar namunasi
5. ✅ **package.json** - Nodemailer qo'shildi

---

## 🎨 Email Dizayni

Yuborilgan email:

- ✅ HTML formatda (chiroyli dizayn)
- ✅ Responsive (mobile/desktop)
- ✅ Gradient header
- ✅ Parol katta va aniq ko'rinadi
- ✅ Ogohlantirish xabari bor
- ✅ Kompaniya branding bilan

---

## 🔐 Xavfsizlik

- ✅ Email tekshiriladi (database'da bormi?)
- ✅ Parol ekranda ko'rsatilmaydi (faqat emailda)
- ✅ App Password ishlatiladi (oddiy parol emas)
- ✅ SMTP ulanish xavfsiz (TLS)
- ✅ Parolni o'zgartirish tavsiya qilinadi

---

## ❌ Muammolar va Yechimlar

### 1. Email Kelmasa:

**Sabab:** SMTP sozlamalari noto'g'ri yoki App Password noto'g'ri

**Yechim:**

- `.env.local` faylini tekshiring
- `SMTP_USER` - to'g'ri email manzili
- `SMTP_PASSWORD` - to'g'ri App Password (16 belgi, bo'sh joysiz)
- Serverni qayta ishga tushiring
- Gmail Spam papkasini tekshiring

### 2. "Authentication failed" Xatosi:

**Sabab:** App Password noto'g'ri yoki 2FA yoqilmagan

**Yechim:**

- Google Account'da 2-Step Verification yoqilganligini tekshiring
- App Password'ni qayta yarating
- Yangi App Password'ni `.env.local` ga qo'ying

### 3. "Connection timeout":

**Sabab:** Internet yoki firewall

**Yechim:**

- Internet ulanishni tekshiring
- Firewall 587 portni to'sib qo'ymagan bo'lishini tekshiring

---

## 📊 Qanday Ishlaydi?

```
1. Foydalanuvchi: email@gmail.com kiritadi
2. Backend: Database'da email bormi? → ✅ Bor
3. Backend: Yangi parol yaratadi → "A7k!mP9@xL2n"
4. Backend: db.json'da parolni yangilaydi
5. Backend: Gmail SMTP orqali email yuboradi
6. Gmail: Foydalanuvchiga email yuboradi
7. Foydalanuvchi: Email'dan parolni oladi
8. Foydalanuvchi: Yangi parol bilan kiradi
9. Foydalanuvchi: Settings'da parolni o'zgartiradi
```

---

## 📧 Email Namunasi

Subject: **🔐 Password Reset - Admin Dashboard**

```
Hello Admin,

We received a request to reset your password. Your new temporary password is:

╔═══════════════════════════╗
║   A7k!mP9@xL2n          ║
╚═══════════════════════════╝

⚠️ Important: Please change this password immediately after logging in.
Go to Settings → Security → Change Password.

© 2025 Admin Dashboard. All rights reserved.
```

---

## 🎯 Production Uchun

Production'da `.env.local` o'rniga environment variables ishlatiladi:

```bash
# Vercel, Netlify, yoki boshqa hosting
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## ✅ Tayyor!

Endi hammasi ishlashi kerak. Agar muammo bo'lsa - terminalda xato xabarlarini ko'ring yoki menga yozing!

🚀 **Happy Coding!**
