import type { MetadataRoute } from 'next'
import { getSiteOrigin } from 'lib/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
	const origin = getSiteOrigin()
	const now = new Date()

	const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> =
		[
			{ path: '/', priority: 1, changeFrequency: 'weekly' },
			{ path: '/demo', priority: 0.9, changeFrequency: 'weekly' },
			{ path: '/login', priority: 0.2, changeFrequency: 'monthly' },
			{ path: '/register', priority: 0.2, changeFrequency: 'monthly' },
		]

	return routes.map(r => ({
		url: `${origin}${r.path}`,
		lastModified: now,
		changeFrequency: r.changeFrequency,
		priority: r.priority,
	}))
}

