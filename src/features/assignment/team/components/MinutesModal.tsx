'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from 'styled-system/css';
import { center } from 'styled-system/patterns';
import { ModalCheckIcon } from '@/components/icons/ModalCheckIcon';
import { Divider } from '@/components/Divider';
import DatePicker from '@/components/DatePicker';
import { Textarea } from '@/components/TextField';

interface MinutesModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const overlayStyle = center({
  position: 'fixed',
  inset: 0,
  bg: 'rgba(0, 0, 0, 0.6)',
  zIndex: 'modal',
});

const modalContainerStyle = css({
  width: '45rem',
  height: '38.25rem',
  bg: 'bg',
  borderRadius: '0.75rem',
  padding: '2rem',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
});

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'full',
  pb: '1rem',
});

const datePickerContainerStyle = css({
  display: 'flex',
  pt: '1.75rem',
  pb: '2.5rem',
});

const contentContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const contentItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const contentItemLabelStyle = css({
  textStyle: 'body2.r',
});

export const MinutesModal = ({ open, onClose, onSave }: MinutesModalProps) => {
  const handleOverlayClick = () => onClose();
  const handleBoxClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleCheckClick = () => {
    onSave?.();
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div className={overlayStyle} onClick={handleOverlayClick}>
      <div className={modalContainerStyle} onClick={handleBoxClick}>
        <header className={headerStyle}>
          <span>MM.DD 회의록</span>
          <button type='button' onClick={handleCheckClick} aria-label='저장'>
            <ModalCheckIcon />
          </button>
        </header>
        <Divider />

        <div className={datePickerContainerStyle}>
          <DatePicker />
        </div>

        <div className={contentContainerStyle}>
          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>안건</label>
            <Textarea size='modal' placeholder='안건' />
          </div>

          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>결과</label>
            <Textarea size='modal' placeholder='결과' />
          </div>
          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>논의</label>
            <Textarea size='modal' placeholder='논의' />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
