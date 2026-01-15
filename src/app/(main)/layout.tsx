import { cookies } from 'next/headers';
import { Sidebar } from '@/components/Sidebar';
import { HomeButtonBar } from '@/components/HomeButtonBar';
import { parseUICookie } from '@/lib/parse-ui-cookie';
import { css } from '../../../styled-system/css';
import { Modal } from '@/components/Modal';

// 레이아웃 스타일
const layoutContainerStyle = css({
  display: 'flex',
  minH: '100vh',
  bg: 'bg',
});

const mainContentStyle = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 쿠키를 읽어 초기 상태 파싱
  const cookieStore = await cookies();
  const uiCookie = cookieStore.get('ui-storage');
  const initialUIState = parseUICookie(uiCookie?.value);

  return (
    <div className={layoutContainerStyle}>
      <Sidebar
        initialCollapsed={initialUIState.isSidebarCollapsed}
        initialTheme={initialUIState.theme}
      />
      <main className={mainContentStyle}>
        <HomeButtonBar />
        {children}
      </main>
      <Modal />
    </div>
  );
}
