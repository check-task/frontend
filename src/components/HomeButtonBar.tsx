'use client';

import Image from 'next/image';
import Link from 'next/link';
import { css } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { NotificationButton } from './NotificationButton';

export const HomeButtonBar = () => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const theme = useUIStore((state) => state.theme);

  const logoSrc = theme === 'dark' ? '/HomeLogoDark.svg' : '/HomeLogo.svg';

  return (
    <div
      className={containerStyle}
      style={{
        width: isSidebarCollapsed ? 'calc(100% - 3.75rem)' : 'calc(100% - 15rem)',
        left: isSidebarCollapsed ? '3.75rem' : '15rem',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Link
        href='/'
        className={css({
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
        })}
      >
        <Image src={logoSrc} alt='HomeLogo' width={240} height={44} priority />
      </Link>

      <div className={notificationButtonWrapperStyle}>
        <Link href='/alarm'>
          <NotificationButton />
        </Link>
      </div>
    </div>
  );
};

// 홈 버튼 바 컨테이너
const containerStyle = css({
  position: 'fixed',
  bg: 'bg',
  pt: '1.25rem',
  pb: '1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 'sticky',
});

// 알림 버튼 Wrapper
const notificationButtonWrapperStyle = css({
  position: 'absolute',
  right: '3.25rem',
});
