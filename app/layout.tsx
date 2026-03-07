import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from 'lib/config/site'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: SITE_NAME,
		template: `%s • ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	alternates: { canonical: '/' },
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: '/',
		siteName: SITE_NAME,
		title: SITE_NAME,
		description:
			'Explore a production-style Next.js admin dashboard with analytics, products, orders, and user management.',
		images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: ['/twitter-image'],
	},
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/icon', type: 'image/png' },
		],
		apple: [{ url: '/apple-icon', type: 'image/png' }],
	},
	manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#0b1220' },
		{ media: '(prefers-color-scheme: dark)', color: '#0b1220' },
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					enableColorScheme
					storageKey='theme'
				>
					<div className='min-h-screen flex flex-col'>
						<main className='flex-1'>
							{children}
						</main>
						<footer className='border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur text-center py-4 text-sm text-slate-600 dark:text-slate-400'>
							© {new Date().getFullYear()} Admin Dashboard. Built with Next.js + Tailwind.
						</footer>
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
