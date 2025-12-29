import { AnalyticsRange, getAnalytics } from 'lib/api/analytics'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const rangeParam = (searchParams.get('range') as AnalyticsRange) || '7d'

		const data = getAnalytics(rangeParam)
		// Return the analytics object directly so client receives { kpis, revenueSeries, ... }
		return NextResponse.json(data)
	} catch {
		return NextResponse.json(
			{ success: false, message: 'Failed to load analytics' },
			{ status: 500 },
		)
	}
}
