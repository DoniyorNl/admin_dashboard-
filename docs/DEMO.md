## Public Demo (`/demo`)

For portfolio and Lighthouse/recruiter reviews, the project exposes a **public, read-only demo page** at:

- `/demo`

### Why this exists

The full dashboard experience is intentionally protected by authentication. A completely private app is hard to evaluate
quickly, so `/demo` provides:

- A real dashboard-like analytics view
- No login wall
- Demo data via `/api/analytics`

### Where it lives

- Demo page: `app/demo/page.tsx`
- Demo analytics client: `app/demo/DemoAnalyticsClient.tsx`

### Extending the demo

Add more read-only “preview” widgets here (charts, tables, empty/error states) without touching authenticated routes under
`app/(dashboard)/`.

