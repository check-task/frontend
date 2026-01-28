'use client';

import { AlarmTimeCheckIcon } from '@/components/icons/AlarmTimeCheckIcon';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-system/jsx';

// 시간 배열
const HOURS = Array.from({ length: 24 }, (_, i) => 24 - i);

interface AlarmTimeSelectMenuProps {
  onSelect: (value: number) => void;
}

export const AlarmTimeSelectMenu = ({ onSelect }: AlarmTimeSelectMenuProps) => {
  // 드롭박스에서 진행하던 외부 클릭시 닫기를 부모로 뺌
  return (
    <DropdownContainer>
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
    overflow: 'hidden',
    // 그림자 추가
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
    _dark: {
      boxShadow:
        '0 0 4px 0 rgba(238, 239, 241, 0.08), 0 1px 4px 0 rgba(238, 239, 241, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.16)',
    },
  },
});

// 프로토타입에 스크롤이 없어서 일단은 안보이게
const ScrollWrapper = styled('div', {
  base: {
    // 선택 시간 5개만 보이도록 높이 지정
    height: '12.5rem',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

const OptionItem = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    // 시간이랑 체크 표시가 딱 맞춰지도록
    justifyContent: 'space-between',
    width: '7.75rem',
    height: '2.5rem',
    padding: '0.5rem 0.25rem 0.5rem 0.5rem',
    textStyle: 'body1.r',
    color: 'gray.700',
    cursor: 'pointer',
    borderRadius: '0.25rem',

    '& svg': {
      visibility: 'hidden',
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
