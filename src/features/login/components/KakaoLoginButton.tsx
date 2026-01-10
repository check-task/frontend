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

// HTML 버튼 태그의 속성을 사용하기 위해 (예 : onClick)
interface KakaoLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const KakaoLoginButton = ({ ...props }: KakaoLoginButtonProps) => (
  <Button {...props}>
    <Image src='/kakao-icon.svg' alt='kakaoicon' width={24} height={27} />
    <ButtonText>카카오 로그인</ButtonText>
  </Button>
);
