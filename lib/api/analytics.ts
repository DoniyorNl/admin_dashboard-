import fs from 'fs'
import path from 'path'

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
	id: number
	amount: number
	createdAt: string
}

export interface AnalyticsData {
	kpis: Record<string, KpiMetric>
	revenueSeries: RevenuePoint[]
	channels: ChannelMetric[]
	recentOrders: RecentOrder[]
}

/**
 * Server-side helper
 * fs bilan backend/analytics.db.json ni o‘qiydi
 */
export function getAnalytics(range: AnalyticsRange): AnalyticsData {
	const filePath = path.join(process.cwd(), 'backend', 'db.json')
	const raw = fs.readFileSync(filePath, 'utf-8')
	const db = JSON.parse(raw)

	// Range bo‘yicha data qaytarish
	return db.analytics[range]
}
