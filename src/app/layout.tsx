import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { parseUICookie } from '@/lib/parse-ui-cookie';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://checktask.kro.kr'),
  title: {
    template: '%s | CHECKTASK',
    default: 'CHECKTASK',
  },
  description: '대학생을 위한 경량 과제 관리 서비스',
  openGraph: {
    url: 'https://checktask.kro.kr',
    type: 'website',
  },
  verification: {
    google: 'W6LMixy2ulbtgwVR4UxJ_ZvWj2nG0UPq-_jzL79ay3g',
    other: {
      'naver-site-verification': '4336d845ba93370943e355e1d47cb53b8777e5ca',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 쿠키를 읽어 초기 상태 파싱
  const cookieStore = await cookies();
  const uiCookie = cookieStore.get('ui-storage');
  const initialUIState = parseUICookie(uiCookie?.value);

  return (
    <html
      lang='ko'
      suppressHydrationWarning
      data-theme={initialUIState.theme}
      data-sidebar-collapsed={String(initialUIState.isSidebarCollapsed)}
    >
      <head />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
