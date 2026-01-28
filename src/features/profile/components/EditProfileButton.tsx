'use client';

import { useModalStore } from '@/stores/modal-store';
import { EditProfileModalContent } from './EditProfileModalContent';
import { styled } from 'styled-system/jsx';

export const EditProfileButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '프로필 변경',
      content: <EditProfileModalContent />,
      headerType: 'withClose',
    });
  };

  return (
    <UnderlineLink onClick={handleOpen}>
      <ProfileLink>프로필 변경</ProfileLink>
      <Underline />
    </UnderlineLink>
  );
};

const UnderlineLink = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
});

const ProfileLink = styled('span', {
  base: {
    textStyle: 'body4.m',
    color: 'blue.500',
  },
});

const Underline = styled('span', {
  base: {
    width: '100%',
    height: '0.0625rem',
    bg: 'blue.500',
  },
});
