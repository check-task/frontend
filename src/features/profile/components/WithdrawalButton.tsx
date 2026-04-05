'use client';

import { css } from 'styled-system/css';
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
    <button className={underlineLinkStyle} onClick={handleOpen}>
      <span className={linkTextStyle}>회원탈퇴</span>
      <span className={underlineStyle} />
    </button>
  );
};

const underlineLinkStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  textStyle: 'body4.m',
  color: 'gray.500',
  cursor: 'pointer',
  alignSelf: 'flex-start',
});

const linkTextStyle = css({
  textStyle: 'body4.m',
  color: 'gray.400',
});

const underlineStyle = css({
  width: '100%',
  height: '0.0625rem',
  bg: 'gray.400',
});
