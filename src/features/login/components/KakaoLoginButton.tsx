'use client';

import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import Image from 'next/image';

const Button = styled('button', {
  base: hstack.raw({
    marginTop: 'auto',
    paddingY: '0.9375rem',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '24.125rem',
    height: '3.375rem',
    bg: '#FEE500',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  }),
});

const ButtonText = styled('span', {
  base: {
    textStyle: 'btn',
    color: 'rgba(0, 0, 0, 0.85)',
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
      <Image src='/kakao-icon.svg' alt='kakaoicon' width={24} height={27} />
      <ButtonText>카카오 로그인</ButtonText>
    </Button>
  );
};
