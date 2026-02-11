import { styled } from '../../../../styled-system/jsx';
import { hstack, stack } from '../../../../styled-system/patterns';
import { ProfileSection } from '@/features/profile/components/ProfileSection';
import { ManagementSection } from '@/features/profile/components/ManagementSection';
import { WithdrawalButton } from '@/features/profile/components/WithdrawalButton';
import { ProfileFooter } from '@/features/profile/components/ProfileFooter';

// 프로필 설정 페이지
export default function ProfilePage() {
  return (
    <Layout.Container>
      <ProfileSection />
      <ManagementSection />

      {/* 푸터 */}
      <ProfileFooter>
        <WithdrawalButton />
        <Text.FooterLinks>
          <Text.FooterLink>개인 정보 처리 방침</Text.FooterLink>
          <Divider />
          <Text.FooterLink>사이트 이용 약관</Text.FooterLink>
          <Divider />
          <Text.FooterCopyright>
            © 2025, CheckTask, All rights reserved.
          </Text.FooterCopyright>
        </Text.FooterLinks>
      </ProfileFooter>
    </Layout.Container>
  );
}

// 레이아웃 관련 스타일
const Layout = {
  Container: styled('div', {
    base: stack.raw({
      gap: '1.75rem',
      width: '62.25rem',
      marginX: 'auto',
      marginTop: '3.25rem',
      marginBottom: '3.75rem',
    }),
  }),
};

// 텍스트 스타일
const Text = {
  FooterLinks: styled('div', {
    base: hstack.raw({ gap: '0.25rem', alignItems: 'center' }),
  }),
  FooterLink: styled('span', {
    base: {
      textStyle: 'body4.r',
      color: 'gray.300',
    },
  }),
  FooterCopyright: styled('span', {
    base: {
      textStyle: 'body4.r',
      color: 'gray.300',
    },
  }),
};

// 구분선
const Divider = styled('div', {
  base: {
    width: '1px',
    height: '1rem',
    bg: 'gray.300',
    alignSelf: 'center',
  },
});
