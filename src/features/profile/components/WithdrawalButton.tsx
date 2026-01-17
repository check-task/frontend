'use client';

import { styled } from 'styled-system/jsx';
import { useModalStore } from '@/stores/modal-store';
import { WithdrawalModalContent } from './WithdrawalModalContent';

export const WithdrawalButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '회원탈퇴',
      content: <WithdrawalModalContent />,
      headerType: 'none',
    });
  };

  return (
    <UnderlineLink onClick={handleOpen}>
      <LinkText>회원탈퇴</LinkText>
      <Underline />
    </UnderlineLink>
  );
};

const UnderlineLink = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    textStyle: 'body4.m',
    color: 'gray.500',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
});

const LinkText = styled('span', {
  base: {
    textStyle: 'body4.m',
    color: 'gray.400',
  },
});

const Underline = styled('span', {
  base: {
    width: '100%',
    height: '0.0625rem',
    bg: 'gray.400',
  },
});
