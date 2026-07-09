import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { LoginButton } from '@/features/login/components/LoginButton';
import { LoginCarousel } from '@/features/login/components/LoginCarousel';
import { MobileLoginView } from '@/features/login/components/MobileLoginView';
import { TabletLoginView } from '@/features/login/components/TabletLoginView';
import { WithdrawnAlert } from '@/features/login/components/WithdrawnAlert';
import { SignupSuccessLoginModal } from '@/features/login/components/SignupSuccessLoginModal';
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

      {/* 태블릿 전용: 768px 이상 터치 기반 환경 */}
      <div
        className={css({
          display: 'none',
          '@media (min-width: 768px) and (hover: none)': {
            display: 'block',
          },
          '@media (min-width: 768px) and (pointer: coarse)': {
            display: 'block',
          },
        })}
      >
        <TabletLoginView />
      </div>

      {/* 데스크톱 전용: 768px 이상 마우스/트랙패드 기반 환경 */}
      <div
        className={css({
          ...pageStyle,
          display: 'none',
          '@media (min-width: 768px) and (hover: hover) and (pointer: fine)': {
            display: 'flex',
          },
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
          <LoginButton />
        </div>

        {/* 탈퇴 계정 복구 모달 */}
        {isWithdrawn && <WithdrawnAlert token={token} />}
        <SignupSuccessLoginModal />
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
    height: '5.375rem',
    paddingX: '7.5rem',
    paddingY: '1.25rem',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 -1px 4px 0 rgba(0, 0, 0, 0.08)',
  }),
);
