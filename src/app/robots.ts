import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/alarm', '/assignment', '/completed', '/profile', '/auth'],
    },
    sitemap: 'https://checktask.kro.kr/sitemap.xml',
  };
}
