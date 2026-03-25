import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://checktask.kro.kr',
      lastModified: new Date(),
    },
    {
      url: 'https://checktask.kro.kr/login',
      lastModified: new Date(),
    },
  ];
}
