'use client';

import { useEffect, ReactNode } from 'react';
import { css } from '../../styled-system/css';
import { center, stack } from '../../styled-system/patterns';
import { CloseIcon } from './icons/CloseIcon';

interface ModalProps {
  title: string;
  // 기본 닫기
  onClose: () => void;
  isOpen: boolean;
  children?: ReactNode;
  // 헤더 오른쪽 요소 (아이콘 또는 없음)
  rightElement?: React.ReactElement | null;
  // 아이콘 클릭 시 실행할 추가 함수
  onRightClick?: () => void;
}

export const Modal = ({
  title,
  onClose,
  isOpen,
  children,
  rightElement = <CloseIcon />,
  onRightClick,
}: ModalProps) => {
  // 닫혀 있는 경우
  if (!isOpen) return null;

  // 아이콘 실행 시 기본 닫기 + 사용자 추가 함수 실행을 위함
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

  return (
    // 오버레이 부분
    <div
      onClick={onClose}
      className={center({
        // 모달 배경 고정
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bg: 'rgba(0, 0, 0, 0.6)',
        zIndex: 'modal',
      })}
    >
      {/* 모달 본체 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={stack({
          // 안에 요소에 따라 모달이 늘어날 수 있도록
          width: 'fit-content',
          // 가로가 가장 긴 모달 기준
          maxWidth: '45rem',
          // 임시- 내용에 따라 늘어나도록 해야함
          bg: 'bg',
          // 시맨틱으로 처리하기
          borderRadius: '0.75rem',
          padding: '2rem',
          gap: '0',
        })}
      >
        {/* 모달 헤더 영역 */}
        <div
          className={stack({
            width: 'full',
            gap: '1rem',
          })}
        >
          {/* 제목과 오른쪽 아이콘 영역 */}
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            })}
          >
            {/* 제목 */}
            <div
              className={css({
                textStyle: 'body1.m',
                color: 'fg.default',
              })}
            >
              {title}
            </div>

            {/* 아이콘 영역 */}
            {rightElement && (
              <button
                type='button'
                onClick={handleRightClick}
                className={css({ cursor: 'pointer' })}
              >
                {rightElement}
              </button>
            )}
          </div>

          {/* 선 역할 */}
          <div
            className={css({
              borderBottom: '1px solid',
              borderColor: 'gray.200',
              width: 'full',
            })}
          />
        </div>
        {/* 컨텐츠 영역 */}
        <div className={css({ width: 'full' })}>{children}</div>
      </div>
    </div>
  );
};
