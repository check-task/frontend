'use client';

import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import Image from 'next/image';

export const KakaoLoginButton = () => {
  const handleClick = () => {
    const isLocal = process.env.NODE_ENV === 'development';
    const state = isLocal ? 'local' : 'prod';
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao?state=${state}`;
  };

  return (
    <button className={buttonStyle} onClick={handleClick}>
      <Image src='/kakao-icon.svg' alt='kakaoicon' width={18} height={18} />
      <span className={buttonTextStyle}>카카오 로그인</span>
    </button>
  );
};

const buttonStyle = css(
  hstack.raw({
    paddingX: '0.875rem',
    paddingY: '0.6875rem',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '11.8125rem',
    height: '2.8125rem',
    bg: '#FEE500',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  }),
);

const buttonTextStyle = css({
  textStyle: 'btn',
  color: 'rgba(0, 0, 0, 0.85)',
});
