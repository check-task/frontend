'use client';

import Image from 'next/image';
import Link from 'next/link';
import { css } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { NotificationButton } from './NotificationButton';

const SIDEBAR_WIDTH_EXPANDED = '15rem';

export const HomeButtonBar = () => {
  const theme = useUIStore((state) => state.theme);

  const logoSrc = theme === 'dark' ? '/HomeLogoDark.svg' : '/HomeLogo.svg';

  return (
    <div className={containerStyle}>
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
  top: 0,
  left: SIDEBAR_WIDTH_EXPANDED,
  bg: 'bg',
  pt: '1.25rem',
  pb: '1.25rem',
  width: `calc(100% - ${SIDEBAR_WIDTH_EXPANDED})`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 'sticky',
  transition:
    'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '[data-sidebar-collapsed="true"] &': {
    left: 0,
    width: '100%',
  },
});

// 알림 버튼 Wrapper
const notificationButtonWrapperStyle = css({
  position: 'absolute',
  right: '3.25rem',
});
