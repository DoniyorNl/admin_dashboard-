import React from 'react'

type Props = {
  data?: number[]
  color?: string
  height?: number
}

export default function Sparkline({ data = [2,4,3,5,6,5,7,8], color = '#06b6d4', height = 40 }: Props) {
  const max = Math.max(...data)
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(' ')
  return (
    <svg viewBox={`0 0 100 100`} className="w-full h-10">
      <polyline
        fill="none"
        points={points}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
