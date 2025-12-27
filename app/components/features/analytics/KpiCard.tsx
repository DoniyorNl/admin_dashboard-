import React from 'react'

type Props = {
  title: string
  value: string | number
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  icon?: React.ReactNode
}

export default function KpiCard({ title, value, delta, trend = 'flat', icon }: Props) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
        <div className="flex items-center gap-3">
          {icon && <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center">{icon}</div>}
          {delta && <div className={`text-sm font-medium ${trendColor}`}>{delta}</div>}
        </div>
      </div>
    </div>
  )
}
