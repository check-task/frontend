'use client';

import Image from 'next/image';
import { css } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { NotificationButton } from './NotificationButton';

export const HomeButtonBar = () => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle}>
      <button
        className={css({
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          // 사이드바가 접혀있을 때는 전체 화면 기준으로 중앙 정렬하기 위해 사이드바 너비만큼 왼쪽으로 이동
          // 사이드바가 펼쳐져있을 때는 main 영역 기준으로 중앙 정렬
          marginLeft: isSidebarCollapsed ? '-4.5rem' : '0',
          transition: 'margin-left 0.3s ease',
        })}
      >
        <Image src='/HomeLogo.svg' alt='HomeLogo' width={240} height={44} />
      </button>

      <div className={notificationButtonWrapperStyle}>
        <NotificationButton />
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
});

// 알림 버튼 Wrapper
const notificationButtonWrapperStyle = css({
  position: 'absolute',
  right: '3.25rem',
});
