'use client';

import { useState } from 'react';
import { cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';

// Props 정의
interface TaskToggleProps {
  // 개인 팀 과제수
  personalCount?: number;
  teamCount?: number;
  // 토글 버튼 클릭시 실행되는 콜백 함수(현재 선택된 타입을 전달)
  onToggle?: (type: 'personal' | 'team') => void;
  // url에 따라 상태가 바뀌도록 (추가)
  selectedType: 'personal' | 'team';
}

export function TaskToggle({
  // 기본값
  personalCount = 0,
  teamCount = 0,
  onToggle,
  selectedType,
}: TaskToggleProps) {
  // 상태 관리
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const handlePress = (type: 'personal' | 'team') => {
    onToggle?.(type); // 클릭되었음을 부모에게 알리기
  };

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div
        className={buttonStyle({ active: selectedType === 'personal' })}
        onClick={() => handlePress('personal')}
      >
        <span>개인과제</span>
        <span className={countStyle({ active: selectedType === 'personal' })}>
          {personalCount}
        </span>
      </div>
      <div
        className={buttonStyle({ active: selectedType === 'team' })}
        onClick={() => handlePress('team')}
      >
        <span>팀과제</span>
        <span className={countStyle({ active: selectedType === 'team' })}>
          {teamCount}
        </span>
      </div>
    </div>
  );
}

// Container 스타일
export const containerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    bg: 'gray.100',
    borderRadius: '0.5rem',
    padding: '0.75rem 0.5rem',
    height: '3.375rem',
    _hover: {
      '& div, & span': {
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
    },
  },
  variants: {
    collapsed: {
      // 사이드바 닫혀 있음
      true: {
        w: '49.625rem',
        gap: '0.125rem',
        transition: 'width 0.3s ease-in-out, gap 0.3s ease-in-out',
      },
      // 사이드바 열여 있음
      false: {
        w: '43.25rem',
        gap: '0.5rem',
        transition: 'width 0.3s ease-in-out, gap 0.3s ease-in-out',
      },
    },
  },
});

// 버튼 스타일
export const buttonStyle = cva({
  base: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    h: '2.375rem',
    borderRadius: '0.25rem',
    color: 'gray.900',
    cursor: 'pointer',
    gap: '0.5rem',
    transition: 'none',
  },
  variants: {
    // 토글 내 활성화 비활성화
    active: {
      true: {
        color: 'gray.900',
        bg: 'gray.0',
        textStyle: 'body2.m',
      },
      false: {
        color: 'gray.500',
        backgroundColor: 'gray.100',
        textStyle: 'body2.r',
      },
    },
  },
});

// 숫자 스타일
export const countStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '0.25rem', // 좌우 패딩 px기준 4
    minW: '1.375rem',
    h: '1.375rem',
    fontVariantNumeric: 'normal',
    textAlign: 'center',
    borderRadius: '0.25rem',
    textStyle: 'body4.m',
    transition: 'none',
  },
  variants: {
    active: {
      true: {
        // 활성화
        backgroundColor: 'blue.600',
        color: 'gray.0',
      },
      false: {
        // 비활성화
        backgroundColor: 'gray.300',
        color: 'bg',
      },
    },
  },
});
