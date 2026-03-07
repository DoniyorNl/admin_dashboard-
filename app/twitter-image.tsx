import { ImageResponse } from 'next/og'
import { SITE_NAME } from 'lib/config/site'

export const runtime = 'edge'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

export default function TwitterImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: 64,
					background:
						'radial-gradient(120% 120% at 0% 0%, #93c5fd 0%, #6366f1 45%, #0b1220 100%)',
					color: 'white',
					fontFamily:
						'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
					<div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -1.4, lineHeight: 1.05 }}>
						{SITE_NAME}
					</div>
					<div style={{ fontSize: 24, opacity: 0.92, lineHeight: 1.35 }}>
						Portfolio-ready Next.js admin dashboard with public demo + real UI polish.
					</div>
				</div>

				<div
					style={{
						width: 220,
						height: 220,
						borderRadius: 56,
						background: 'rgba(255,255,255,0.14)',
						border: '1px solid rgba(255,255,255,0.18)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 92,
						fontWeight: 900,
						letterSpacing: -3,
					}}
				>
					AD
				</div>
			</div>
		),
		size,
	)
}

