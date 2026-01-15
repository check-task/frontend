'use client';

import Image from 'next/image';
import { css } from 'styled-system/css';
import { NotificationButton } from './NotificationButton';

export const HomeButtonBar = () => {
  return (
    <div className={containerStyle}>
      <button className={buttonStyle}>
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
  position: 'relative',
  pt: '1.25rem',
  pb: '1.25rem',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

// 홈 버튼
const buttonStyle = css({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
});

// 알림 버튼 Wrapper
const notificationButtonWrapperStyle = css({
  position: 'absolute',
  right: '3.25rem',
});
