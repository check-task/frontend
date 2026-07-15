import type { Metadata } from 'next';
import { css } from '../../../../styled-system/css';
import { hstack } from '../../../../styled-system/patterns';
import { ProfileSection } from '@/features/profile/components/ProfileSection';
import { ManagementSection } from '@/features/profile/components/ManagementSection';
import { WithdrawalButton } from '@/features/profile/components/WithdrawalButton';
import { ProfileFooter } from '@/features/profile/components/ProfileFooter';
import { PolicyLink } from '@/features/profile/components/PolicyLink';
import { ProfilePageContainer } from '@/features/profile/components/ProfilePageContainer';

export const metadata: Metadata = {
  title: '프로필',
};

// 프로필 설정 페이지
export default function ProfilePage() {
  return (
    <ProfilePageContainer>
      <ProfileSection />
      <ManagementSection />

      {/* 푸터 */}
      <ProfileFooter>
        <WithdrawalButton />
        <div className={footerLinksStyle}>
          <PolicyLink type='privacy' />
          <div className={dividerStyle} />
          <PolicyLink type='terms' />
          <div className={dividerStyle} />
          <span className={footerCopyrightStyle}>
            © 2025, CheckTask, All rights reserved.
          </span>
        </div>
      </ProfileFooter>
    </ProfilePageContainer>
  );
}

// 텍스트 스타일
const footerLinksStyle = css(
  hstack.raw({ gap: '0.25rem', alignItems: 'center' }),
);

const footerCopyrightStyle = css({
  textStyle: 'body4.r',
  color: 'gray.300',
});

// 구분선
const dividerStyle = css({
  width: '1px',
  height: '1rem',
  bg: 'gray.300',
  alignSelf: 'center',
});
