'use client';

import { useEffect } from 'react';
import { css, cva } from '../../styled-system/css';
import { stack } from '../../styled-system/patterns';
import { token } from '../../styled-system/tokens';
import { CloseIcon } from './icons/CloseIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LeftIcon } from './icons/LeftIcon';
import { useModalStore } from '@/stores/modal-store';
import { createPortal } from 'react-dom';

export const Modal = () => {
  // 전역 상태 구독
  const { isOpen, options, closeModal } = useModalStore();
  const modalOptions: NonNullable<typeof options> = options ?? {
    content: null,
  };
  const {
    title,
    content,
    headerType = 'withClose',
    onLeftClick,
    onRightClick,
    presentation = 'default',
  } = modalOptions;

  // 왼쪽 아이콘 클릭 핸들러
  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
      return;
    }

    closeModal();
  };

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

  // 모달이 열려있지 않거나 서버에서 실행되는 경우를 차단
  if (!isOpen || !options || typeof window === 'undefined') return null;

  const renderTitle = () => {
    if (headerType !== 'withBack') {
      return <div className={titleStyle}>{title}</div>;
    }

    return (
      <div className={backTitleWrapStyle}>
        <button
          type='button'
          onClick={handleLeftClick}
          aria-label='이전'
          className={iconButtonStyle}
        >
          <LeftIcon />
        </button>
        <div className={titleStyle}>{title}</div>
      </div>
    );
  };

  // 헤더 타입에 따른 오른쪽 아이콘 결정
  const renderRightIcon = () => {
    if (headerType === 'none' || headerType === 'withBack') return null;

    return (
      <button
        type='button'
        onClick={handleRightClick}
        aria-label={headerType === 'withClose' ? '닫기' : '확인'}
        className={iconButtonStyle}
      >
        {headerType === 'withClose' ? (
          <CloseIcon />
        ) : (
          <CheckCircleIcon size={28} color={token('colors.gray.900')} />
        )}
      </button>
    );
  };

  return createPortal(
    // 오버레이 부분
    <div className={overlayStyle} onClick={closeModal}>
      <div className={innerWrapStyle}>
        {/* 모달 본체 */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={modalContainerStyle}
        >
          {presentation === 'bare' ? (
            content
          ) : (
            <>
              <div className={stack({ gap: '1rem', width: 'full' })}>
                {/* 모달 해더 */}
                <header className={headerRecipe({ type: headerType })}>
                  {renderTitle()}
                  {renderRightIcon()}
                </header>
                {/* 선 역할 */}
                <span className={dividerStyle} />
              </div>
              {/* 컨텐츠 영역 */}
              <div className={css({ width: 'full' })}>{content}</div>
            </>
          )}
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
      // 뒤로가기 아이콘
      withBack: {
        justifyContent: 'flex-start',
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

const titleStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const backTitleWrapStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

const iconButtonStyle = css({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
});
