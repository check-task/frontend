'use client';

import { useEffect, ReactNode } from 'react';
import { css, cva } from '../../styled-system/css';
import { center, stack } from '../../styled-system/patterns';
import { CloseIcon } from './icons/CloseIcon';
import { ModalCheckIcon } from './icons/ModalCheckIcon';

// ===== 스타일 정의 =====
//
// 오버레이 스타일
const overlayStyle = center({
  position: 'fixed',
  inset: 0,
  // 한번만 써서 그냥 넣었습니다.
  bg: 'rgba(0, 0, 0, 0.6)',
  zIndex: 'modal',
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

  // 기본은 체크 아이콘
  defaultVariants: {
    type: 'withClose',
  },
});

// 구분선
const dividerStyle = css({
  borderBottom: '1px solid',
  borderColor: 'gray.200',
  width: 'full',
});

// ===== 타입 정의 =====

interface ModalProps {
  title: string;
  onClose: () => void;
  isOpen: boolean;
  children?: ReactNode;
  // 헤더 타입 (3가지)
  headerType?: 'none' | 'withClose' | 'withCheck';
  // 아이콘 클릭 시 실행할 추가 함수
  onRightClick?: () => void;
}

// ===== 컴포넌트 =====
export const Modal = ({
  title,
  onClose,
  isOpen,
  children,
  headerType = 'withClose',
  onRightClick,
}: ModalProps) => {
  if (!isOpen) return null;

  // 아이콘 클릭 핸들러
  const handleRightClick = () => {
    if (onRightClick) {
      onRightClick(); // 아이콘을 눌렀을 때 추가로 할 기능
    }
    onClose(); // 기본은 닫기
  };

  //esc눌렀을 때
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 헤더 타입에 따른 아이콘 결정
  const renderIcon = () => {
    if (headerType === 'none') return null;

    return (
      <button
        type='button'
        onClick={handleRightClick}
        className={css({ cursor: 'pointer', display: 'flex' })}
      >
        {headerType === 'withClose' ? <CloseIcon /> : <ModalCheckIcon />}
      </button>
    );
  };

  return (
    // 오버레이 부분
    <div className={overlayStyle} onClick={onClose}>
      {/* 모달 본체 */}
      <div onClick={(e) => e.stopPropagation()} className={modalContainerStyle}>
        <div className={stack({ gap: '1rem', width: 'full' })}>
          {/* 모달 해더 */}
          <header className={headerRecipe({ type: headerType })}>
            <div className={css({ textStyle: 'body1.m', color: 'fg.default' })}>
              {title}
            </div>
            {renderIcon()}
          </header>
          {/* 선 역할 */}
          <div className={dividerStyle} />
        </div>
        {/* 컨텐츠 영역 */}
        <div className={css({ width: 'full' })}>{children}</div>
      </div>
    </div>
  );
};
