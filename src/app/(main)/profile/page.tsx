import { styled } from '../../../../styled-system/jsx';
import { hstack, stack } from '../../../../styled-system/patterns';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { CameraIcon } from '@/components/icons/CameraIcon';
import { Card } from '@/features/profile/components/Card';
import { NotificationSetting } from '@/features/profile/components/NotificationSetting';
import { FolderSetting } from '@/features/profile/components/FolderSetting';
import { EditProfileButton } from '@/features/profile/components/EditProfileButton';
import { WithdrawalButton } from '@/features/profile/components/WithdrawalButton';
import { AddFolderButton } from '@/features/profile/components/AddFolderButton';
import { EditFolderButton } from '@/features/profile/components/EditFolderButton';
import { DeleteFolderButton } from '@/features/profile/components/DeleteFolderButton';
import { AlarmTimeSelect } from '@/features/profile/components/AlarmTimeSelect';

// 프로필 설정 페이지
export default function ProfilePage() {
  return (
    <Layout.Container>
      <Layout.Section>
        <Text.Title>프로필 설정</Text.Title>

        {/* 프로필 카드 */}
        <Card type='profile'>
          <Profile.ImageSection>
            <Profile.ImageWrapper>
              <Profile.Image />
              <Profile.ImageOverlay>
                <CameraIcon />
              </Profile.ImageOverlay>
            </Profile.ImageWrapper>
            <Profile.Name>송월</Profile.Name>
          </Profile.ImageSection>

          {/* 구분선 */}
          <Divider type='profile' />

          {/* 기본 정보 섹션 */}
          <Profile.InfoSection>
            <Profile.BasicInfo>
              <Profile.InfoHeader>
                <Text.SectionTitle>기본정보</Text.SectionTitle>
                <EditProfileButton />
              </Profile.InfoHeader>
              <Profile.InfoContent>
                {[
                  { label: '연락처', value: '010-8831-4721' },
                  { label: '이메일', value: 'songwol@tukorea.ac.kr' },
                ].map((info) => (
                  <Profile.InfoRow key={info.label}>
                    <Text.Label>{info.label}</Text.Label>
                    <Text.Value>{info.value}</Text.Value>
                  </Profile.InfoRow>
                ))}
              </Profile.InfoContent>
            </Profile.BasicInfo>
            <StyledButton.UnderlineLink>
              <Text.PasswordLink>비밀번호 변경</Text.PasswordLink>
              <Underline color='password' />
            </StyledButton.UnderlineLink>
          </Profile.InfoSection>
        </Card>
      </Layout.Section>

      <Layout.Section>
        {/* 과제 관리 섹션 */}
        <Text.Title>과제 관리</Text.Title>

        <Card type='management'>
          {/* 알림 설정 */}
          <NotificationSetting>
            <Text.SectionTitle>알림 설정</Text.SectionTitle>
            <Setting.Content>
              <Setting.Row>
                <Text.SettingLabel>최종 마감 알림</Text.SettingLabel>
                <AlarmTimeSelect />
              </Setting.Row>
              <Setting.Row>
                <Text.SettingLabel>TASK별 알림</Text.SettingLabel>
                <AlarmTimeSelect />
              </Setting.Row>
            </Setting.Content>
          </NotificationSetting>

          {/* 구분선 */}
          <Divider type='management' />

          {/* 폴더 설정 */}
          <FolderSetting>
            <Folder.Header>
              <Text.SectionTitle>폴더 설정</Text.SectionTitle>
              <AddFolderButton />
            </Folder.Header>
            <Folder.List>
              {[
                { color: 'black' as const, name: '프로그래밍' },
                { color: 'red' as const, name: '그만세' },
                { color: 'yellow' as const, name: '웹서프' },
                { color: 'purple' as const, name: '팀과제' },
              ].map((folder) => (
                <Folder.Item key={folder.name}>
                  <Folder.Info>
                    <Folder.Color color={folder.color} />
                    <Folder.Name>{folder.name}</Folder.Name>
                  </Folder.Info>
                  <Folder.Actions>
                    <EditFolderButton
                      folderName={folder.name}
                      folderColor={folder.color}
                    />
                    <DeleteFolderButton
                      folderName={folder.name}
                      folderColor={folder.color}
                    />
                  </Folder.Actions>
                </Folder.Item>
              ))}
            </Folder.List>
          </FolderSetting>
        </Card>
      </Layout.Section>

      {/* 푸터 */}
      <Layout.Footer>
        <WithdrawalButton />
        <Text.FooterLinks>
          <Text.FooterLink>개인 정보 처리 방침</Text.FooterLink>
          <Divider type='footer' />
          <Text.FooterLink>사이트 이용 약관</Text.FooterLink>
          <Divider type='footer' />
          <Text.FooterLink>쿠키 기본 설정</Text.FooterLink>
          <Divider type='footer' />
          <Text.FooterCopyright>
            © 2025, CheckTask, All rights reserved.
          </Text.FooterCopyright>
        </Text.FooterLinks>
      </Layout.Footer>
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
      marginY: '2rem',
    }),
  }),
  Section: styled('section', {
    base: stack.raw({ gap: '0.75rem' }),
  }),
  Footer: styled('footer', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.75rem',
    }),
  }),
};

// 텍스트 스타일
const Text = {
  Title: styled('h1', {
    base: { textStyle: 'h3', color: 'gray.900' },
  }),
  SectionTitle: styled('h3', {
    base: { textStyle: 'h4', color: 'gray.900' },
  }),
  Label: styled('span', {
    base: { textStyle: 'body1.r', color: 'gray.400', width: '3.4375rem' },
  }),
  Value: styled('span', {
    base: { textStyle: 'body1.m', color: 'gray.700' },
  }),
  PasswordLink: styled('span', {
    base: {
      textStyle: 'body4.m',
      color: 'gray.500',
      width: '5rem',
      height: '1.25rem',
    },
  }),
  SettingLabel: styled('span', {
    base: { textStyle: 'body1.r', color: 'gray.400' },
  }),
  Footer: styled('p', {
    base: { textStyle: 'body4.r', color: 'gray.400' },
  }),
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
  WithdrawalLink: styled('span', {
    base: { textStyle: 'body4.m', color: 'gray.400' },
  }),
};

// 버튼 스타일
const StyledButton = {
  Edit: styled('button', {
    base: {
      textStyle: 'btn',
      color: 'blue.500',
      paddingX: '1rem',
      paddingY: '0.5rem',
      borderRadius: '0.5rem',
      border: '1px solid',
      borderColor: 'blue.500',
      bg: 'transparent',
      cursor: 'pointer',
      _hover: { bg: 'blue.50' },
    },
  }),
  UnderlineLink: styled('button', {
    base: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      textStyle: 'body4.m',
      color: 'gray.500',
      cursor: 'pointer',
      alignSelf: 'flex-start',
    },
  }),
  Add: styled('button', {
    base: {
      textStyle: 'h4',
      color: 'gray.400',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      _hover: { color: 'gray.600' },
    },
  }),
  Action: styled('button', {
    base: {
      textStyle: 'body1.r',
      color: 'gray.400',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      _hover: { color: 'gray.600' },
    },
  }),
};

// 프로필 섹션 스타일
const Profile = {
  ImageSection: styled('div', {
    base: stack.raw({ gap: '1.5rem', alignItems: 'center' }),
  }),
  ImageWrapper: styled('div', {
    base: {
      position: 'relative',
      cursor: 'pointer',
    },
  }),
  Image: styled('div', {
    base: {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
      bg: 'blue.100',
    },
  }),
  ImageOverlay: styled('div', {
    base: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
      background:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), var(--colors-blue-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'opacity 0.2s ease',
      _hover: {
        opacity: 1,
      },
    },
  }),
  CameraIcon: styled('span', {
    base: {
      fontSize: '1.5rem',
      color: 'white',
    },
  }),
  Name: styled('p', {
    base: { textStyle: 'body1.m', color: 'gray.900' },
  }),
  InfoSection: styled('div', {
    base: stack.raw({ gap: '2.5rem', flex: 1 }),
  }),
  InfoHeader: styled('div', {
    base: hstack.raw({ justifyContent: 'space-between', alignItems: 'center' }),
  }),
  BasicInfo: styled('div', {
    base: stack.raw({ gap: '1.75rem' }),
  }),
  InfoContent: styled('div', {
    base: stack.raw({ gap: '1.5rem' }),
  }),
  InfoRow: styled('div', {
    base: hstack.raw({ gap: '1.5rem' }),
  }),
};

// 설정 섹션 스타일
const Setting = {
  Row: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '3rem',
    }),
  }),
  Content: styled('div', {
    base: stack.raw({ gap: '0.5rem' }),
  }),
};

// 폴더 스타일
const Folder = {
  Header: styled('div', {
    base: hstack.raw({ justifyContent: 'space-between', alignItems: 'center' }),
  }),
  List: styled('div', {
    base: stack.raw({ gap: '0.5rem' }),
  }),
  Item: styled('div', {
    base: hstack.raw({
      gap: '0.75rem',
      alignItems: 'center',
      height: '3rem',
    }),
  }),
  Info: styled('div', {
    base: hstack.raw({
      gap: '0.75rem',
      alignItems: 'center',
      flex: 1,
    }),
  }),
  Color: styled('div', {
    base: { width: '1.25rem', height: '1.25rem', borderRadius: '50%' },
    variants: {
      color: {
        red: { bg: 'sub.01.100' },
        yellow: { bg: 'sub.02.100' },
        green: { bg: 'sub.03.100' },
        purple: { bg: 'sub.04.100' },
        black: { bg: 'sub.05.100' },
      },
    },
  }),
  Name: styled('span', {
    base: { textStyle: 'body1.m', color: 'gray.700', flex: 1 },
  }),
  Actions: styled('div', {
    base: hstack.raw({ gap: '0.75rem' }),
  }),
};

// 구분선
const Divider = styled('div', {
  base: {
    width: '1px',
    alignSelf: 'center',
  },
  variants: {
    type: {
      profile: { height: '13.625rem', bg: 'gray.200' },
      management: { height: '17.25rem', bg: 'gray.200' },
      footer: { height: '1rem', bg: 'gray.300' },
    },
  },
});

// 언더라인
const Underline = styled('span', {
  base: {
    width: '100%',
    height: '0.0625rem',
  },
  variants: {
    color: {
      password: { bg: 'gray.500' },
      withdrawal: { bg: 'gray.400' },
    },
  },
});
