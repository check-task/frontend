'use client';

import { AlertCheckIcon } from '@/components/icons/AlertCheckIcon';
import { AlertXIcon } from '@/components/icons/AlertXIcon';
import { css } from 'styled-system/css';
import type { ReactNode } from 'react';

interface AlertProps {
  message: ReactNode;
  variant?: 'check' | 'x';
}

export const Alert = ({ message, variant = 'check' }: AlertProps) => {
  return (
    <div className={containerStyle}>
      <span className={iconStyle}>
        {variant === 'x' ? <AlertXIcon /> : <AlertCheckIcon />}
      </span>
      <p className={textStyle}>{message}</p>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  px: '1.25rem',
  py: '0.75rem',
  bg: 'white',
  borderRadius: '6.25rem',
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
  minWidth: '24.25rem',
  maxWidth: '36.875rem',
});

const iconStyle = css({
  flexShrink: 0,
});

const textStyle = css({
  textStyle: 'body2.r',
  color: '#081221',
});
