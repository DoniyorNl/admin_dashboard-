import { ImageResponse } from 'next/og'
import { SITE_DESCRIPTION, SITE_NAME } from 'lib/config/site'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: 64,
					background:
						'radial-gradient(120% 120% at 0% 0%, #60a5fa 0%, #4f46e5 35%, #0b1220 100%)',
					color: 'white',
					fontFamily:
						'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<div
						style={{
							width: 64,
							height: 64,
							borderRadius: 18,
							background: 'rgba(255,255,255,0.14)',
							border: '1px solid rgba(255,255,255,0.18)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 900,
							fontSize: 28,
							letterSpacing: -1,
						}}
					>
						AD
					</div>
					<div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{SITE_NAME}</div>
				</div>

				<div style={{ maxWidth: 880 }}>
					<div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05 }}>
						Analytics, operations, and admin UX—ready to demo.
					</div>
					<div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.35, opacity: 0.92 }}>
						{SITE_DESCRIPTION}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						fontSize: 18,
						opacity: 0.9,
					}}
				>
					<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
						<div
							style={{
								padding: '10px 14px',
								borderRadius: 999,
								background: 'rgba(255,255,255,0.14)',
								border: '1px solid rgba(255,255,255,0.18)',
							}}
						>
							Next.js App Router
						</div>
						<div
							style={{
								padding: '10px 14px',
								borderRadius: 999,
								background: 'rgba(255,255,255,0.14)',
								border: '1px solid rgba(255,255,255,0.18)',
							}}
						>
							Tailwind CSS
						</div>
						<div
							style={{
								padding: '10px 14px',
								borderRadius: 999,
								background: 'rgba(255,255,255,0.14)',
								border: '1px solid rgba(255,255,255,0.18)',
							}}
						>
							Auth + Demo Mode
						</div>
					</div>

					<div style={{ fontWeight: 700 }}>admin-dashboard</div>
				</div>
			</div>
		),
		size,
	)
}

