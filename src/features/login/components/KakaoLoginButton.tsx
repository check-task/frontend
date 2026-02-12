'use client';

import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import Image from 'next/image';

const Button = styled('button', {
  base: hstack.raw({
    marginTop: 'auto',
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
});

const ButtonText = styled('span', {
  base: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: '0.9375rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '150%',
  },
});

export const KakaoLoginButton = () => {
  const handleClick = () => {
    // 개발환경에서는 state=local, 배포환경에서는 state=prod
    const isLocal = process.env.NODE_ENV === 'development';
    const state = isLocal ? 'local' : 'prod';
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao?state=${state}`;
  };

  return (
    <Button onClick={handleClick}>
      <Image src='/kakao-icon.svg' alt='kakaoicon' width={18} height={18} />
      <ButtonText>카카오 로그인</ButtonText>
    </Button>
  );
};
