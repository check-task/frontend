import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { LoginCarousel } from '@/features/login/components/LoginCarousel';
import { WithdrawnAlert } from '@/features/login/components/WithdrawnAlert';
import Image from 'next/image';

interface LoginPageProps {
  searchParams: Promise<{ status?: string; token?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { status, token } = await searchParams;
  const isWithdrawn = status === 'withdrawn' && !!token;

  return (
    <Container.Page>
      {/* 메인 영역 - 캐러셀 */}
      <LoginCarousel />

      {/* 하단 바 */}
      <Container.BottomBar>
        <Image
          src='/login-logo.svg'
          alt='채택 로고'
          width={140}
          height={25.85}
        />
        <Container.BottomRight>
          <Text.KakaoGuide>
            아이디와 비밀번호 입력하기 귀찮으시죠?
            <br />
            1초 회원가입으로 입력없이 간편하게 로그인 하세요.
          </Text.KakaoGuide>
          <KakaoLoginButton />
        </Container.BottomRight>
      </Container.BottomBar>

      {/* 탈퇴 계정 복구 모달 */}
      {isWithdrawn && <WithdrawnAlert token={token} />}
    </Container.Page>
  );
}

// Container 관련 스타일
const Container = {
  Page: styled('div', {
    base: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
    },
  }),
  BottomBar: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '5.3125rem',
      paddingX: '7.5rem',
      paddingY: '1.25rem',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 -1px 4px 0 rgba(0, 0, 0, 0.08)',
    }),
  }),
  BottomRight: styled('div', {
    base: hstack.raw({
      gap: '1.5rem',
      alignItems: 'center',
    }),
  }),
};

// 텍스트 스타일
const Text = {
  KakaoGuide: styled('p', {
    base: {
      textStyle: 'body3.r',
      color: 'gray.600',
    },
  }),
};
