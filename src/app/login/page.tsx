import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { LoginConsentText } from '@/features/login/components/LoginConsentText';
import { LoginCarousel } from '@/features/login/components/LoginCarousel';
import { MobileLoginView } from '@/features/login/components/MobileLoginView';
import { TabletLoginView } from '@/features/login/components/TabletLoginView';
import { WithdrawnAlert } from '@/features/login/components/WithdrawnAlert';
import Image from 'next/image';

interface LoginPageProps {
  searchParams: Promise<{ status?: string; token?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { status, token } = await searchParams;
  const isWithdrawn = status === 'withdrawn' && !!token;

  const headersList = await headers();
  const { device } = userAgent({ headers: headersList });
  const isMobile = device.type === 'mobile';
  const isTablet = device.type === 'tablet';

  if (isMobile)
    return (
      <>
        <MobileLoginView />
        {isWithdrawn && <WithdrawnAlert token={token!} />}
      </>
    );
  if (isTablet)
    return (
      <>
        <TabletLoginView />
        {isWithdrawn && <WithdrawnAlert token={token!} />}
      </>
    );

  return (
    <>
      {/* 모바일 전용 (< 768px) */}
      <div className={css({ display: 'block', md: { display: 'none' } })}>
        <MobileLoginView />
      </div>

      {/* 태블릿 전용 (768px – 1024px) */}
      <div
        className={css({
          display: 'none',
          md: { display: 'block' },
          lg: { display: 'none' },
        })}
      >
        <TabletLoginView />
      </div>

      {/* 데스크톱 전용 (≥ 1024px) */}
      <div
        className={css({
          ...pageStyle,
          display: 'none',
          lg: { display: 'flex' },
        })}
      >
        <LoginCarousel />

        {/* 하단 바 */}
        <div className={bottomBarStyle}>
          <Image
            src='/login-logo.svg'
            alt='채택 로고'
            width={140}
            height={25.85}
          />
          <div className={bottomRightStyle}>
            <div className={textColumnStyle}>
              <p className={kakaoGuideStyle}>
                아이디와 비밀번호 입력하기 귀찮으시죠?
                <br />
                1초 회원가입으로 입력없이 간편하게 로그인 하세요.
              </p>
              <LoginConsentText />
            </div>
            <KakaoLoginButton />
          </div>
        </div>

        {/* 탈퇴 계정 복구 모달 */}
        {isWithdrawn && <WithdrawnAlert token={token} />}
      </div>
    </>
  );
}

// Container 관련 스타일
const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflow: 'hidden',
} as const;

const bottomBarStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '6.375rem',
    paddingX: '7.5rem',
    paddingY: '1.25rem',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 -1px 4px 0 rgba(0, 0, 0, 0.08)',
  }),
);

const bottomRightStyle = css(
  hstack.raw({
    gap: '1.5rem',
    alignItems: 'center',
  }),
);

// 텍스트 스타일
const textColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

const kakaoGuideStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});
