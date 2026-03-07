## SEO & Metadata

This project includes production-style metadata and social preview assets via Next.js App Router:

- **Global metadata**: `app/layout.tsx`
- **App icon**: `app/icon.tsx` (`/icon`)
- **Apple icon**: `app/apple-icon.tsx` (`/apple-icon`)
- **OpenGraph image**: `app/opengraph-image.tsx` (`/opengraph-image`)
- **Twitter image**: `app/twitter-image.tsx` (`/twitter-image`)
- **Robots**: `app/robots.ts` (`/robots.txt`)
- **Sitemap**: `app/sitemap.ts` (`/sitemap.xml`)
- **PWA manifest**: `app/manifest.ts` (`/manifest.webmanifest`)

### Required env

Set the site URL so generated absolute URLs are correct:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

