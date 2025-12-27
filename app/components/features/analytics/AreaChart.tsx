import React from 'react'

type Props = {
	data?: number[]
	color?: string
	showGrid?: boolean
	animate?: boolean
}

export default function AreaChart({
	data = [120, 145, 130, 165, 140, 180, 155, 195, 170, 210],
	color = '#2560eb',
	showGrid = true,
	animate = true,
}: Props) {
	if (!data || data.length === 0) {
		return (
			<div className='w-full h-full flex items-center justify-center text-gray-400'>
				No data available
			</div>
		)
	}

	const max = Math.max(...data)
	const min = Math.min(...data)
	const range = max - min

	// Normalizatsiya qilish - min/max orasida
	const normalizedData = data.map(d => ((d - min) / range) * 80 + 10)

	// SVG points yaratish
	const points = normalizedData
		.map((d, i) => {
			const x = (i / (data.length - 1)) * 100
			const y = 100 - d
			return `${x},${y}`
		})
		.join(' ')

	// Area path (gradient fill uchun)
	const areaPoints = normalizedData.map((d, i) => {
		const x = (i / (data.length - 1)) * 100
		const y = 100 - d
		return `${x},${y}`
	})

	const areaPath = `M 0,100 L ${areaPoints.map(p => p).join(' L ')} L 100,100 Z`

	// Grid lines
	const gridLines = showGrid ? [0, 25, 50, 75, 100] : []

	return (
		<svg viewBox='0 0 100 100' className='w-full h-full' preserveAspectRatio='none'>
			{/* Grid lines */}
			{showGrid &&
				gridLines.map(y => (
					<line
						key={y}
						x1='0'
						y1={y}
						x2='100'
						y2={y}
						stroke='currentColor'
						strokeWidth='1'
						className='text-gray-200 dark:text-gray-700'
						opacity='0.5'
					/>
				))}

			{/* Gradient definition */}
			<defs>
				<linearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
					<stop offset='0%' stopColor={color} stopOpacity='0.3' />
					<stop offset='100%' stopColor={color} stopOpacity='0.05' />
				</linearGradient>
			</defs>

			{/* Area fill */}
			<path
				d={areaPath}
				fill='url(#areaGradient)'
				stroke='none'
				className={animate ? 'animate-[fadeIn_0.6s_ease-out]' : ''}
			/>

			{/* Line */}
			<polyline
				points={points}
				fill='none'
				stroke={color}
				strokeWidth={0.8}
				strokeLinecap='round'
				strokeLinejoin='round'
				vectorEffect='non-scaling-stroke'
				className={animate ? 'animate-[drawLine_1.2s_ease-out]' : ''}
				style={{
					strokeDasharray: animate ? '1500' : 'none',
					strokeDashoffset: animate ? '1000' : '0',
					animation: animate ? 'drawLine 1.2s ease-out forwards' : 'none',
				}}
			/>

		

			{/* Inline keyframes */}
			<style>{`
				@keyframes drawLine {
					to {
						stroke-dashoffset: 0;
					}
				}
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
			`}</style>
		</svg>
	)
}
