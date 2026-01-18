'use client';

import { AlarmTimeCheckIcon } from '@/components/icons/AlarmTimeCheckIcon';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-system/jsx';

// 시간 배열
const HOURS = Array.from({ length: 24 }, (_, i) => 24 - i);

interface AlarmTimeSelectMenuProps {
  onSelect: (value: number) => void;
  onClose: () => void;
}

export const AlarmTimeSelectMenu = ({
  onSelect,
  onClose,
}: AlarmTimeSelectMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지 로직 추가
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <DropdownContainer ref={menuRef}>
      {/* 스크롤이 필요할 수 있으므로 maxHeight를 추가하는 것이 좋습니다 */}
      <ScrollWrapper>
        {HOURS.map((hour) => (
          <OptionItem key={hour} onClick={() => onSelect(hour)}>
            <span>{hour}시간 전</span>
            <AlarmTimeCheckIcon />
          </OptionItem>
        ))}
      </ScrollWrapper>
    </DropdownContainer>
  );
};

const DropdownContainer = styled('div', {
  base: {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 'dropdown',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.25rem',
    bg: 'gray.0',
    borderRadius: '0.5rem',
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
    overflow: 'hidden',
  },
});

// 프로토타입에 스크롤이 없어서 일단은 안보이게
const ScrollWrapper = styled('div', {
  base: {
    height: '12.75rem',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

const OptionItem = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '7.75rem',
    height: '2.5rem',
    padding: '0.5rem 0.25rem 0.5rem 0.5rem',
    textStyle: 'body1.r',
    color: 'gray.700',
    cursor: 'pointer',
    borderRadius: '0.25rem',

    '& svg': {
      visibility: 'hidden',
      marginLeft: '0.5rem',
    },

    _hover: {
      bg: 'blue.50',
      color: 'blue.500',
      textStyle: 'body1.m',

      '& svg': {
        visibility: 'visible',
      },
    },
  },
});
