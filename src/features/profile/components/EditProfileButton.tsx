'use client';

import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { EditProfileModalContent } from './EditProfileModalContent';
import type { User } from '@/types/api/user';

interface EditProfileButtonProps {
  user: User;
}

export const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '프로필 변경',
      content: <EditProfileModalContent user={user} />,
      headerType: 'withClose',
    });
  };

  return (
    <button className={underlineLinkStyle} onClick={handleOpen}>
      <span className={profileLinkStyle}>프로필 변경</span>
      <span className={underlineStyle} />
    </button>
  );
};

const underlineLinkStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  cursor: 'pointer',
  alignSelf: 'flex-start',
});

const profileLinkStyle = css({
  textStyle: 'body4.m',
  color: 'blue.500',
});

const underlineStyle = css({
  width: '100%',
  height: '0.0625rem',
  bg: 'blue.500',
});
