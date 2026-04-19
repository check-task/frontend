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
    <div className={containerStyle}>
      <Link
        href='/'
        className={css({
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          // 사이드바가 접혀있을 때는 전체 화면 기준으로 중앙 정렬하기 위해 사이드바 너비만큼 왼쪽으로 이동
          // 사이드바가 펼쳐져있을 때는 main 영역 기준으로 중앙 정렬
          marginLeft: isSidebarCollapsed ? '0' : '14.75rem',
          transition: 'margin-left 0.3s ease',
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
  width: '100%',
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
