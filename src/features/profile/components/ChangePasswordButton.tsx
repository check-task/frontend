'use client';

import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { ChangePasswordModalContent } from './ChangePasswordModalContent';

export const ChangePasswordButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '비밀번호 변경',
      content: <ChangePasswordModalContent />,
      headerType: 'withClose',
    });
  };

  return (
    <button type='button' className={changePasswordButtonStyle} onClick={handleOpen}>
      비밀번호 변경
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

const changePasswordButtonStyle = css({
  ...actionButtonBaseStyle,
  bg: 'blue.50',
  color: 'blue.500',
});
