import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
	// Fixes incorrect workspace-root inference when there are lockfiles above this repo.
	// This prevents dev from looking for manifests in the wrong place.
	turbopack: {
		root: repoRoot,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
}

export default nextConfig
