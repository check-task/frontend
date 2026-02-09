'use client';

import { useEffect } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { Card } from '@/features/profile/components/Card';
import { EditProfileButton } from '@/features/profile/components/EditProfileButton';
import { useAuthStore } from '@/stores/auth-store';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

export const ProfileSection = () => {
  const { data, isLoading } = useMyInfo();
  const setUser = useAuthStore((state) => state.setUser);

  // auth 스토어에 최신 유저 정보 동기화
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data?.user, setUser]);

  if (isLoading || !data) {
    return null;
  }

  const { user } = data;

  return (
    <Layout.Section>
      <Text.Title>프로필 설정</Text.Title>

      <Card type='profile'>
        <Profile.ImageSection>
          {user.profileImage ? (
            <Profile.ImageActual src={user.profileImage} alt={user.nickname} />
          ) : (
            <Profile.ImageDefault />
          )}
          <Profile.Name>{user.nickname}</Profile.Name>
        </Profile.ImageSection>

        <Divider />

        <Profile.InfoSection>
          <Profile.BasicInfo>
            <Text.SectionTitle>기본정보</Text.SectionTitle>
            <Profile.InfoContent>
              {[
                { label: '연락처', value: user.phoneNum },
                { label: '이메일', value: user.email },
              ].map((info) => (
                <Profile.InfoRow key={info.label}>
                  <Text.Label>{info.label}</Text.Label>
                  <Text.Value>{info.value}</Text.Value>
                </Profile.InfoRow>
              ))}
            </Profile.InfoContent>
          </Profile.BasicInfo>
          <EditProfileButton user={user} />
        </Profile.InfoSection>
      </Card>
    </Layout.Section>
  );
};

// 레이아웃
const Layout = {
  Section: styled('section', {
    base: stack.raw({ gap: '0.75rem' }),
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
};

// 프로필 섹션 스타일
const Profile = {
  ImageSection: styled('div', {
    base: stack.raw({ gap: '1.5rem', alignItems: 'center' }),
  }),
  ImageDefault: styled('div', {
    base: {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
      bg: 'blue.100',
    },
  }),
  ImageActual: styled('img', {
    base: {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
      objectFit: 'cover',
    },
  }),
  Name: styled('p', {
    base: { textStyle: 'body1.m', color: 'gray.900' },
  }),
  InfoSection: styled('div', {
    base: stack.raw({ gap: '2.5rem', flex: 1 }),
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

// 구분선
const Divider = styled('div', {
  base: {
    width: '1px',
    height: '13.625rem',
    bg: 'gray.200',
    alignSelf: 'center',
  },
});
