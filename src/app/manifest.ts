import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CHECKTASK',
    short_name: '채택',
    description: '대학생을 위한 경량 과제 관리 서비스',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCFCFD',
    // theme_color: '#081221',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
