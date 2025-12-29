// hooks/useAnalytics.ts
'use client'

import { useEffect, useState } from 'react'

/* =======================
   TYPES - ✅ EXPORT qo'shish kerak
======================= */

export type AnalyticsRange = '7d' | '30d' | '90d'

export interface KpiMetric {
	value: number
	delta: number
	trend: 'up' | 'down'
}

export interface RevenuePoint {
	date: string
	value: number
}

export interface ChannelMetric {
	name: string
	share: number
	trend: number[]
}

export interface RecentOrder {
	// ✅ export qo'shing
	id: number
	amount: number
	createdAt: string
}

/* =======================
   HOOK
======================= */

export function useAnalytics() {
	const [range, setRange] = useState<AnalyticsRange>('30d')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [kpis, setKpis] = useState<Record<string, KpiMetric>>({})
	const [revenueSeries, setRevenueSeries] = useState<RevenuePoint[]>([])
	const [channels, setChannels] = useState<ChannelMetric[]>([])
	const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])

	useEffect(() => {
		async function loadAnalytics() {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`/api/analytics?range=${range}`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = await res.json()
				setKpis(data.kpis)
				setRevenueSeries(data.revenueSeries)
				setChannels(data.channels)
				setRecentOrders(data.recentOrders)
			} catch {
				setError('Failed to load analytics data')
			} finally {
				setLoading(false)
			}
		}
		loadAnalytics()
	}, [range])

	return { range, setRange, loading, error, kpis, revenueSeries, channels, recentOrders }
}
