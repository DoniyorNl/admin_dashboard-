import type { MetadataRoute } from 'next'
import { getSiteOrigin, SITE_DESCRIPTION, SITE_NAME } from 'lib/config/site'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: 'Admin',
		description: SITE_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		background_color: '#0b1220',
		theme_color: '#0b1220',
		scope: '/',
		icons: [
			{
				src: `${getSiteOrigin()}/icon`,
				sizes: '32x32',
				type: 'image/png',
			},
			{
				src: `${getSiteOrigin()}/apple-icon`,
				sizes: '180x180',
				type: 'image/png',
			},
		],
	}
}

