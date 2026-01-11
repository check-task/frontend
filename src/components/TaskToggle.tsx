'use client';

import { useState } from 'react';
import { cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';

// Props 정의
interface TaskToggleProps {
  // 사이
  personalCount?: number;
  teamCount?: number;
}

export function TaskToggle({
  // 기본값
  personalCount = 0,
  teamCount = 0,
}: Omit<TaskToggleProps, 'collapsed'>) {
  // 상태 관리
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  // 개인,팀 과제
  const [active, setActive] = useState<'personal' | 'team'>('personal');

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div
        className={buttonStyle({ active: active === 'personal' })}
        onClick={() => setActive('personal')}
      >
        <span>개인과제</span>
        <span className={countStyle({ active: active === 'personal' })}>
          {personalCount}
        </span>
      </div>
      <div
        className={buttonStyle({ active: active === 'team' })}
        onClick={() => setActive('team')}
      >
        <span>팀과제</span>
        <span className={countStyle({ active: active === 'team' })}>
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
    gap: '0.125rem',
    transition: 'all 0.3s ease',
  },
  variants: {
    collapsed: {
      // 사이드바 닫혀 있음
      true: {
        w: '49.625rem',
      },
      // 사이드바 열여 있음
      false: {
        w: '43.25rem',
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
    textStyle: 'body2.r',
    color: 'gray.900',
    cursor: 'pointer',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  variants: {
    // 토글 내 활성화 비활성화
    active: {
      true: {
        color: 'gray.900',
        bg: 'gray.0',
      },
      false: {
        color: 'gray.500',
        backgroundColor: 'gray.100',
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
    // 패딩값은 임의로 설정
    px: '0.5rem',
    minW: '1.375rem',
    h: '1.375rem',
    borderRadius: '0.25rem',
    textStyle: 'body4.r',
    transition: 'all 0.3s ease',
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
