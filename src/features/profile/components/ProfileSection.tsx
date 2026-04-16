'use client';

import { useEffect } from 'react';
import { css } from 'styled-system/css';
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
    <section className={layoutSectionStyle}>
      <h1 className={titleStyle}>프로필 설정</h1>

      <Card type='profile'>
        <div className={profileImageSectionStyle}>
          {user.profileImage ? (
            <img
              className={profileImageActualStyle}
              src={user.profileImage}
              alt={user.nickname}
            />
          ) : (
            <div className={profileImageDefaultStyle} />
          )}
          <p className={profileNameStyle}>{user.nickname}</p>
        </div>

        <div className={dividerStyle} />

        <div className={profileInfoSectionStyle}>
          <div className={profileBasicInfoStyle}>
            <h3 className={sectionTitleStyle}>기본정보</h3>
            <div className={profileInfoContentStyle}>
              {[
                { label: '연락처', value: user.phoneNum },
                { label: '이메일', value: user.email },
              ].map((info) => (
                <div key={info.label} className={profileInfoRowStyle}>
                  <span className={labelStyle}>{info.label}</span>
                  <span className={valueStyle}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>
          <EditProfileButton user={user} />
        </div>
      </Card>
    </section>
  );
};

// 레이아웃
const layoutSectionStyle = css(
  stack.raw({
    gap: '0.75rem',
  }),
);

// 텍스트 스타일
const titleStyle = css({
  textStyle: 'h3',
  color: 'gray.900',
});

const sectionTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});

const labelStyle = css({
  textStyle: 'body1.r',
  color: 'gray.400',
  width: '3.4375rem',
});

const valueStyle = css({
  textStyle: 'body1.m',
  color: 'gray.700',
});

// 프로필 섹션 스타일
const profileImageSectionStyle = css(
  stack.raw({
    gap: '1.5rem',
    alignItems: 'center',
    width: '10rem',
    minWidth: 0,
  }),
);

const profileImageDefaultStyle = css({
  width: '10rem',
  height: '10rem',
  borderRadius: '50%',
  bg: 'blue.100',
});

const profileImageActualStyle = css({
  width: '10rem',
  height: '10rem',
  borderRadius: '50%',
  objectFit: 'cover',
});

const profileNameStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
  width: '100%',
  textAlign: 'center',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});

const profileInfoSectionStyle = css(
  stack.raw({
    gap: '2.5rem',
    flex: 1,
  }),
);

const profileBasicInfoStyle = css(
  stack.raw({
    gap: '1.75rem',
  }),
);

const profileInfoContentStyle = css(
  stack.raw({
    gap: '1.5rem',
  }),
);

const profileInfoRowStyle = css(
  hstack.raw({
    gap: '1.5rem',
  }),
);

// 구분선
const dividerStyle = css({
  width: '1px',
  height: '13.625rem',
  bg: 'gray.200',
  alignSelf: 'center',
});
