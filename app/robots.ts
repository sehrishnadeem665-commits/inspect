import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autofactscheck.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/checkout',
        '/*.json$',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
