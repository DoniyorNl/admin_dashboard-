# Admin Dashboard

English / Uzbek bilingual README — qisqacha loyiha mazmuni, ishga tushirish va arxitektura.

---

## Overview (English)

This is a Next.js (App Router) admin dashboard that uses a small local JSON backend for demo data.

- UI: Tailwind CSS + small component library under `app/components/UI/`.
- Routing & layouts: App Router under `app/` with nested dashboard layout at `app/(dashboard)/dashboard/layout.tsx`.
- API layer: `lib/api/*` contains `apiFetch` and product helpers. `API_BASE_URL` is read from `NEXT_PUBLIC_API_URL` or defaults to `http://localhost:4000`.
- Mock backend: `backend/db.json` served by `json-server` (development only).
- Auth: lightweight mock auth under `app/authAPI/*` (server routes set httpOnly cookies). There is also a client-side `localStorage` token copy used for client guards.

Key behaviors:

- Dashboard is protected — server-side cookie check (via middleware and server layout) prevents unauthenticated access.
- Products page has a client component (`ProductsPageClient.tsx`) that supports search, filters, add/edit/delete in-memory and can be wired to `lib/api/products.ts` for persistent CRUD.

## Getting Started (English)

1. Install dependencies:

```bash
npm install
```

2. Start both mock API and Next.js dev server (cross-platform):

```bash
npm run dev:all
```

3. Open the app:

```text
http://localhost:3000
```

Notes:

- `dev:all` uses `concurrently` to run `json-server` and `next dev` together. You can still run `npm run json` and `npm run dev` separately.
- To change the backend URL, set `NEXT_PUBLIC_API_URL` in your environment.

---

## Overview (O'zbek)

Bu loyiha Next.js (App Router) asosida yozilgan admin dashboard bo'lib, demo ma'lumotlar uchun lokal JSON backend (`json-server`) ishlatadi.

- UI: Tailwind CSS va kichik UI komponentlari `app/components/UI/` da joylashgan.
- Router va layoutlar: `app/` ichida App Router; dashboard layout manzili: `app/(dashboard)/dashboard/layout.tsx`.
- API qatlami: `lib/api/*` ichida `apiFetch` va mahsulotlar uchun yordamchi funksiyalar bor. `API_BASE_URL` `NEXT_PUBLIC_API_URL` dan olinadi yoki `http://localhost:4000` bo'ladi.
- Mock backend: `backend/db.json`, `json-server` orqali dev muhitida ishlaydi.
- Autentifikatsiya: `app/authAPI/*` server route'lari httpOnly cookie o'rnatadi; mijoz tomonda esa `localStorage` ga token nusxasi saqlanadi, bu client-gard uchun ishlatiladi.

Asosiy xususiyatlar:

- Dashboard himoyalangan — server tarafdan cookie tekshiruvi (middleware va server layout orqali) autentifikatsiyasiz kirishni to'xtatadi.
- Mahsulotlar sahifasi client komponent sifatida ishlaydi (`ProductsPageClient.tsx`) — qidiruv, filtr, qo'shish/tahrirlash/o'chirish (hozir asosan frontendda); `lib/api/products.ts` ga ulansa serverga CRUD qiladi.

## Ishga tushirish (O'zbek)

1. Paketlarni o'rnating:

```bash
npm install
```

2. Ikkala xizmatni birgalikda ishga tushirish (cross-platform):

```bash
npm run dev:all
```

3. Brauzerda oching:

```text
http://localhost:3000
```

Izohlar:

- `dev:all` `concurrently` paketidan foydalanadi va `json-server` hamda `next dev` ni birgalikda ishga tushiradi. Xohlasangiz alohida `npm run json` va `npm run dev` dan ham foydalanishingiz mumkin.
- Agar backend URL ni o'zgartirmoqchi bo'lsangiz, `NEXT_PUBLIC_API_URL` muhit o'zgaruvchisidan foydalaning.

---

## Architecture & Important Files

- `app/` — Next.js App Router, layouts va sahifalar.

  - `app/(dashboard)/dashboard/layout.tsx` — server-side layout; cookie orqali auth tekshiradi va agar token bo'lsa client layout (`ClientDashboardLayout`) ni render qiladi.
  - `app/components/auth/Protected.tsx` — client-side guard, localStorage tekshiradi va loading ko'rsatadi.

- `app/authAPI/` — server routes: `login`, `register`, `logout` (mock auth that sets httpOnly cookies and returns a token in JSON for client syncing).

- `lib/api/config.ts` — `API_BASE_URL` va `apiFetch` util.
- `lib/api/products.ts` — products CRUD helpers, shu jumladan `getPaginated` method (uses direct `fetch` to read `X-Total-Count` header).
- `lib/auth.ts` — client helpers: `login`, `register`, `logout` (now store token in `localStorage` after server response).

- `backend/db.json` — mock data used by `json-server`.

## Development notes & decisions

- Auth flow: server sets an httpOnly cookie so server-side checks are secure; client also keeps a non-httpOnly `localStorage` copy for client-side guards and quick UI state. This is a convenience for a demo app — for production prefer server-side sessions or JWT with proper security.
- Server-side protection: layout and `middleware.ts` handle redirects before pages render on the server, preventing flash of unauthenticated content.
- Use `lib/api/*` helpers for network calls — they centralize headers and error handling.

## Scripts

- `npm run dev` — Next.js dev server only.
- `npm run json` — start `json-server` on port 4000.
- `npm run dev:all` — start both services together (uses `concurrently`).
- `npm run build` / `npm run start` — build and start production server.

## Contributing

If you want to improve the project:

- Run `npm install`.
- Start dev servers: `npm run dev:all`.
- Make small, focused changes and follow existing patterns (App Router server/client split, `lib/api/*` helpers, Tailwind UI components).

---

If xohlasangiz, READMEni yanada qisqaroq yoki texnikroq qilib o'zgartiraman, yoki `CONTRIBUTING.md` qo'shib jamoa qoidalarini yozib beraman.
