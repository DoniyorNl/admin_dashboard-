import KpiCard from '@/components/features/analytics/KpiCard'
import Sparkline from '@/components/features/analytics/Sparkline'
import AreaChart from '@/components/features/analytics/AreaChart'
import { Calendar, BarChart2, Users, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
	// Mock data for demo purposes
	const revenue = 12450
	const users = 1245
	const orders = 567
	const aov = 21.78

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
					<p className="text-sm text-slate-600 dark:text-slate-400">Overview of key metrics and trends</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<KpiCard title="Revenue" value={`$${revenue.toLocaleString()}`} delta="+6.4%" trend="up" icon={<DollarSign className="w-4 h-4 text-amber-600" />} />
				<KpiCard title="Users" value={users} delta="+2.1%" trend="up" icon={<Users className="w-4 h-4 text-sky-600" />} />
				<KpiCard title="Orders" value={orders} delta="-1.2%" trend="down" icon={<BarChart2 className="w-4 h-4 text-green-600" />} />
				<KpiCard title="Avg. Order" value={`$${aov}`} delta="+0.4%" trend="up" icon={<Calendar className="w-4 h-4 text-violet-600" />} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<div className="flex items-center justify-between mb-3">
						<div>
							<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Revenue Over Time</h2>
							<p className="text-sm text-slate-500 dark:text-slate-400">Last 30 days</p>
						</div>
						<div className="flex items-center gap-2">
							<button className="px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-900 text-sm">7d</button>
							<button className="px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-900 text-sm">30d</button>
							<button className="px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-900 text-sm">90d</button>
						</div>
					</div>
					<AreaChart data={[10, 20, 15, 30, 25, 40, 35, 50, 45, 55]} />
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Top Channels</h2>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center">GK</div>
								<div>
									<p className="text-sm font-medium text-slate-800 dark:text-slate-100">Organic Search</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">42.1% of traffic</p>
								</div>
							</div>
							<div className="w-24">
								<Sparkline data={[2,4,3,5,6,5,7]} color="#10b981" />
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center">AD</div>
								<div>
									<p className="text-sm font-medium text-slate-800 dark:text-slate-100">Paid Ads</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">29.7% of traffic</p>
								</div>
							</div>
							<div className="w-24">
								<Sparkline data={[3,5,4,6,8,7,9]} color="#f5923e" />
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center">EM</div>
								<div>
									<p className="text-sm font-medium text-slate-800 dark:text-slate-100">Email</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">12.4% of traffic</p>
								</div>
							</div>
							<div className="w-24">
								<Sparkline data={[1,2,1,3,2,4,3]} color="#6366f1" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Recent Orders</h3>
					<div className="text-sm text-slate-600 dark:text-slate-400">A quick list of recent orders for context.</div>
					<ul className="mt-3 space-y-2">
						{[1,2,3,4].map(i => (
							<li key={i} className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-800 dark:text-slate-100">Order #{3200 + i}</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">$ {Math.floor(Math.random()*200 + 20)}</p>
								</div>
								<div className="text-xs text-slate-500">2h ago</div>
							</li>
						))}
					</ul>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Audience Demographics</h3>
					<p className="text-sm text-slate-600 dark:text-slate-400">Top countries and age groups.</p>
					<div className="mt-3 space-y-2 text-sm">
						<div className="flex items-center justify-between"><span>United States</span><span className="font-medium">45%</span></div>
						<div className="flex items-center justify-between"><span>United Kingdom</span><span className="font-medium">12%</span></div>
						<div className="flex items-center justify-between"><span>India</span><span className="font-medium">8%</span></div>
					</div>
				</div>
			</div>
		</div>
	)
}
