'use client';

import Image from 'next/image';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';

export const AppleLoginButton = () => {
  const handleClick = () => {
    const isLocal = process.env.NODE_ENV === 'development';
    const state = isLocal ? 'local' : 'prod';
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/apple?state=${state}`;
  };

  return (
    <button type='button' className={buttonStyle} onClick={handleClick}>
      <Image src='/apple-icon.png' alt='Apple logo' width={24} height={24} />
      <span className={buttonTextStyle}>Apple로 로그인</span>
    </button>
  );
};

const buttonStyle = css(
  hstack.raw({
    justifyContent: 'center',
    gap: '0.25rem',
    width: '24.125rem',
    height: '3.375rem',
    bg: 'bg',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  }),
);

const buttonTextStyle = css({
  textStyle: 'btn',
  color: 'rgba(0, 0, 0, 0.85)',
});
