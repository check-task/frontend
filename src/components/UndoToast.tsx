'use client';

import { useEffect, useRef } from 'react';
import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { UndoIcon } from '@/components/icons/UndoIcon';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
  /** 자동 닫힘 시간 (ms), 기본 4000 */
  duration?: number;
}

export const UndoToast = ({
  message,
  onUndo,
  onClose,
  duration = 4000,
}: UndoToastProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose();
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, onClose]);

  return (
    <div className={toastWrapperStyle({ collapsed: isSidebarCollapsed })}>
      <div className={toastContainerStyle}>
        <p className={messageStyle}>{message}</p>
        <button className={undoButtonStyle} onClick={onUndo}>
          <UndoIcon />
          <span className={undoButtonTextStyle}>되돌리기</span>
        </button>
      </div>
    </div>
  );
};

const toastWrapperStyle = cva({
  base: {
    position: 'fixed',
    top: '10rem',
    zIndex: 'toast',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  variants: {
    collapsed: {
      true: {
        left: '50%',
        transform: 'translateX(-50%)',
        width: '49.625rem',
      },
      false: {
        left: 'calc(50% + 7.5rem)',
        transform: 'translateX(-50%)',
        width: '36.875rem',
      },
    },
  },
});

const toastContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.5rem',
  px: '2.5rem',
  py: '1.25rem',
  bg: 'bg',
  borderRadius: '0.5rem',
  // border: '1px solid',
  // borderColor: 'gray.100',
  shadow: '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
  width: '100%',
});

const messageStyle = css({
  textStyle: 'body2.r',
  color: 'gray.800',
  flex: 1,
});

const undoButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  pl: '0.5rem',
  pr: '1rem',
  py: '0.5rem',
  bg: 'bg',
  border: '1px solid',
  borderColor: 'blue.600',
  borderRadius: '2.5rem',
  cursor: 'pointer',
  flexShrink: 0,
});

const undoButtonTextStyle = css({
  textStyle: 'body3.m',
  color: 'blue.600',
});
