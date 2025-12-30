## Copilot / AI Agent Brief

This repo is a Next.js (App Router) admin dashboard with a small local JSON backend. The goal for agents is to make precise, minimal edits that match existing patterns (app/ router, client/server split, Tailwind UI components, and a thin API layer).

- **App entry:** the app router lives under `app/` (layouts and pages use nested folders). See [app/layout.tsx](app/layout.tsx) and [app/(dashboard)/dashboard/layout.tsx](app/(dashboard)/dashboard/layout.tsx).
- **Client components:** files starting with `'use client'` indicate client-only behavior (e.g., [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) and [app/(dashboard)/dashboard/products/ProductsPageClient.tsx](app/(dashboard)/dashboard/products/ProductsPageClient.tsx).

- **API layer:** reusable API helpers are in `lib/api/*`. Use `API_BASE_URL` from [lib/api/config.ts](lib/api/config.ts) and the `apiFetch` wrapper for network calls. Prefer `lib/api/*` functions for network access rather than ad-hoc fetches.
- **Local mock backend:** data is in [backend/db.json](backend/db.json). Start it with `npm run json` (see `package.json`). The UI expects this at `http://localhost:4000` by default; `NEXT_PUBLIC_API_URL` can override it.

- **Auth pattern:** server routes under `app/authAPI/*` set cookies (e.g., [app/authAPI/login/route.ts](app/authAPI/login/route.ts)). The UI also checks `localStorage` in `app/components/auth/Protected.tsx`. Note: there is an observable mismatch between cookie-based server responses and client-side `localStorage` use—keep changes consistent with `Protected` or update both sides.

- **State & UI conventions:** small, focused components live in `app/components/*` and use Tailwind classes. Follow existing component props and styling patterns (see `app/components/UI/*`).

- **Data mutation & caching:** many fetches use `cache: 'no-store'` for fresh reads (see `lib/api/products.ts`). When adding server-side code, respect the app-router conventions (server components vs client components) and only add `use client` where necessary.

- **Run & debug:** typical dev workflow is to run both services:

```bash
npm run json    # starts the json-server mock API on :4000
npm run dev     # starts Next.js app on :3000
```

- **Where to change things:**
  - API helpers: [lib/api/config.ts](lib/api/config.ts) and [lib/api/products.ts](lib/api/products.ts)
  - Mock data: [backend/db.json](backend/db.json)
  - Auth endpoints: [app/authAPI/*](app/authAPI/)
  - Protected layout: [app/components/auth/Protected.tsx](app/components/auth/Protected.tsx)
  - UI patterns: [app/components/UI/](app/components/UI/)

Agent rules (practical & repo-specific):
- Prefer small, self-contained changes and match existing TSX/TS style.
- Use `apiFetch` and `lib/api/*` helpers when adding network calls; avoid duplicating header/ok checks.
- When modifying auth, update both server-side routes in `app/authAPI/` and client-side checks in `Protected.tsx` or `lib/auth.ts` to avoid inconsistencies.
- For new pages stay within the `app/` router and follow existing nested layout patterns (desktop sidebar + header in dashboard layout).
- Tests are not present; to validate changes manually, run the two scripts above and exercise the UI in the browser.

If anything in this file is unclear or you'd like more detail (examples, exact line references, or a checklist for a specific change), tell me which area to expand. 
