export const SITE_NAME = 'Admin Dashboard'

export const SITE_DESCRIPTION =
	'Production-style admin dashboard built with Next.js App Router, Tailwind CSS, and a demo analytics data pipeline.'

export function getSiteUrl(): string {
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
	if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return 'http://localhost:3000'
}

export function getSiteOrigin(): string {
	return new URL(getSiteUrl()).origin
}

