import { cookies } from 'next/headers';
import { Sidebar } from '@/components/Sidebar';
import { HomeButtonBar } from '@/components/HomeButtonBar';
import { parseUICookie } from '@/lib/parse-ui-cookie';
import { css } from '../../../styled-system/css';
import { Modal } from '@/components/Modal';
import { AlertContainer } from '@/components/AlertContainer';
import { MainContentWrapper } from './MainContentWrapper';
import { AuthProvider } from '@/providers/auth-provider';

// 레이아웃 스타일
const SIDEBAR_WIDTH_COLLAPSED = '3.75rem';
const SIDEBAR_WIDTH_EXPANDED = '15rem';

const layoutContainerStyle = css({
  minH: '100vh',
  bg: 'bg',
});

const mainContentStyle = css({
  minWidth: 0,
  width: '100%',
  minH: '100vh',
  paddingLeft: SIDEBAR_WIDTH_EXPANDED,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '[data-sidebar-collapsed="true"] &': {
    paddingLeft: SIDEBAR_WIDTH_COLLAPSED,
  },
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
    <AuthProvider>
      <div className={layoutContainerStyle}>
        <Sidebar
          initialCollapsed={initialUIState.isSidebarCollapsed}
          initialTheme={initialUIState.theme}
        />
        <main className={mainContentStyle}>
          <HomeButtonBar />
          <MainContentWrapper>{children}</MainContentWrapper>
        </main>
        <Modal />
        <AlertContainer />
      </div>
    </AuthProvider>
  );
}
