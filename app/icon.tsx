import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 8,
					background:
						'radial-gradient(120% 120% at 0% 0%, #60a5fa 0%, #4f46e5 45%, #0b1220 100%)',
				}}
			>
				<div
					style={{
						fontSize: 18,
						fontWeight: 800,
						letterSpacing: -0.5,
						color: 'white',
						fontFamily:
							'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
					}}
				>
					AD
				</div>
			</div>
		),
		size,
	)
}

