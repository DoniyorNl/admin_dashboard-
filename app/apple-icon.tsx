import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 48,
					background:
						'radial-gradient(120% 120% at 0% 0%, #93c5fd 0%, #6366f1 45%, #0b1220 100%)',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 6,
						color: 'white',
						fontFamily:
							'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
					}}
				>
					<div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -2 }}>AD</div>
					<div style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>Dashboard</div>
				</div>
			</div>
		),
		size,
	)
}

