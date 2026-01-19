'use client';

import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { PersonalHeader } from './PersonalHeader';
import { PersonalTaskList } from './PersonalTaskList';

// 페이지 기준 왼쪽 영역 (헤더+ task 목록)
export const PersonalLeftContainer = () => {
  // 완료율(임의값)
  const completionRate = 80; // TODO: 실제 데이터로 교체
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div className={contentWrapperStyle}>
        <PersonalHeader completionRate={completionRate} />
        <div className={taskContainerStyle}>
          <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
            TASK 목록
          </h2>
          <PersonalTaskList />
        </div>
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'all 0.3s ease-in-out',
  },
  variants: {
    collapsed: {
      // 사이드바 닫혀 있음
      true: {
        w: '49.3125rem',
        mr: '1.5rem',
      },
      // 사이드바 열려 있음
      false: {
        w: '43.25rem',
        mr: '1.25rem',
      },
    },
  },
});

const contentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  gap: '2.38rem', // 헤더와 task목록 사이의 간격
});

const taskContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem', // task목록 제목과 리스트 사이 간격
  width: '100%',
});
