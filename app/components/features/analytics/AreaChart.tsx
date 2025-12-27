import React from 'react'

type Props = {
  data?: number[]
  color?: string
}

export default function AreaChart({ data = [10,20,15,30,25,40,35], color = '#2563eb' }: Props) {
  const max = Math.max(...data)
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(' ')
  const areaPath = `M0,100 L${points.split(' ').map(p => p).join(' L ')} L100,100 Z`
  return (
    <svg viewBox="0 0 100 100" className="w-full h-48">
      <path d={areaPath} fill={color + '33'} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
