'use client';

import { useEffect, useState } from 'react';
import { css, cva } from '../../styled-system/css';
import { stack } from '../../styled-system/patterns';
import { CloseIcon } from './icons/CloseIcon';
import { ModalCheckIcon } from './icons/ModalCheckIcon';
import { useModalStore } from '@/stores/modal-store';
import { createPortal } from 'react-dom';

export const Modal = () => {
  // 전역 상태 구독
  const { isOpen, options, closeModal } = useModalStore();

  // 아이콘 클릭 핸들러
  const handleRightClick = () => {
    onRightClick?.();
    closeModal();
  };

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  //esc눌렀을 때
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeModal]);

  // 헤더 타입에 따른 아이콘 결정
  const renderIcon = () => {
    if (headerType === 'none') return null;

    return (
      <button
        type='button'
        onClick={handleRightClick}
        className={css({
          cursor: 'pointer',
          display: 'flex',
        })}
      >
        {headerType === 'withClose' ? <CloseIcon /> : <ModalCheckIcon />}
      </button>
    );
  };

  // 모달이 열려있지 않거나 서버에서 실행되는 경우를 차단
  if (!isOpen || !options || typeof window === 'undefined') return null;
  const { title, content, headerType = 'withClose', onRightClick } = options;

  return createPortal(
    // 오버레이 부분
    <div className={overlayStyle} onClick={closeModal}>
      <div className={innerWrapStyle}>
        {/* 모달 본체 */}
        <div onClick={(e) => e.stopPropagation()} className={modalContainerStyle}>
        <div className={stack({ gap: '1rem', width: 'full' })}>
          {/* 모달 해더 */}
          <header className={headerRecipe({ type: headerType })}>
            <div className={css({ textStyle: 'body1.m', color: 'gray.900' })}>
              {title}
            </div>
            {renderIcon()}
          </header>
          {/* 선 역할 */}
          <span className={dividerStyle} />
        </div>
        {/* 컨텐츠 영역 */}
        <div className={css({ width: 'full' })}>{content}</div>
        </div>
      </div>
    </div>,
    document.body, // 이 위치로 렌더링됨
  );
};

// ===== 스타일 정의 =====
//
// 오버레이 스타일
const overlayStyle = css({
  position: 'fixed',
  inset: 0,
  bg: 'rgba(0, 0, 0, 0.6)',
  zIndex: 'modal',
  overflowY: 'auto',
});

const innerWrapStyle = css({
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// 모달 본체 스타일
const modalContainerStyle = css({
  width: 'fit-content',
  maxWidth: '45rem',
  bg: 'bg',
  borderRadius: '0.75rem',
  padding: '2rem',
});

// 헤더 레이아웃 (variant로 3가지 경우 관리)
const headerRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: 'full',
  },

  variants: {
    type: {
      // 아이콘 없음
      none: {
        justifyContent: 'flex-start',
      },
      // 닫기 아이콘
      withClose: {
        justifyContent: 'space-between',
      },
      // 체크 아이콘
      withCheck: {
        justifyContent: 'space-between',
      },
    },
  },

  // 기본은 닫기 아이콘
  defaultVariants: {
    type: 'withClose',
  },
});

// 구분선
const dividerStyle = css({
  border: '0.5px solid',
  color: 'gray.200',
  width: 'full',
});
