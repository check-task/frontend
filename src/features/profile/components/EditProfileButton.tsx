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
    <button type='button' className={profileButtonStyle} onClick={handleOpen}>
      프로필 변경
    </button>
  );
};

const actionButtonBaseStyle = {
  height: '1.625rem',
  px: '0.75rem',
  py: '0.25rem',
  borderRadius: '0.25rem',
  textStyle: 'body4.m',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const;

const profileButtonStyle = css({
  ...actionButtonBaseStyle,
  bg: 'blue.50',
  color: 'blue.500',
});
