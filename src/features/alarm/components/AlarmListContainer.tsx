'use client';

import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { AlarmCard, AlarmCardProps } from './AlarmCard';
import { useUIStore } from '@/stores/ui-store';

// id 속성 추가
interface AlarmData extends AlarmCardProps {
  id: number;
}

interface AlarmListContainerProps {
  // 알림이 없는 경우도 고려해서 옵셔널
  alarmList?: AlarmData[];
}

export const AlarmListContainer = ({
  alarmList = [],
}: AlarmListContainerProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  // 초기값 세팅 (현재는 더미데이터)
  const [alarms, setAlarms] = useState<AlarmData[]>(alarmList);

  // 개별 알림 삭제 함수
  const handleDelete = (id: number) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  // 모든 알림 삭제 함수
  // confirm은 임시로 넣어두었습니다
  const handleClearAll = () => {
    if (alarms.length > 0 && confirm('모든 알림을 삭제하시겠습니까?')) {
      setAlarms([]);
    }
  };

  return (
    <div
      className={containerStyle({
        collapsed: !!isSidebarCollapsed,
      })}
    >
      <header
        className={flex({
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        })}
      >
        <div className={titleStyle}>알림</div>
        <button onClick={handleClearAll} className={deleteAllButtonStyle}>
          모두 지우기
        </button>
      </header>

      {/* 알림 카드 리스트 */}
      <div className={flex({ direction: 'column', gap: '1rem' })}>
        {alarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            taskTitle={alarm.taskTitle}
            remainingTime={alarm.remainingTime}
            progressRate={alarm.progressRate}
            isDone={alarm.isDone}
            onDelete={() => handleDelete(alarm.id)} // 개별 삭제
          />
        ))}
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    marginX: 'auto',
    marginY: '3.25rem',
    transition: 'width 0.3s ease-in-out',
  },
  variants: {
    // 알림이 없는 경우를 고려해서 컨테이너를 사이드바에 따라 크기 지정
    collapsed: {
      true: {
        // 사이드바가 접혔을 때
        width: '49.625rem',
      },
      false: {
        // 사이드바가 열렸을 때
        width: '43.25rem',
      },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const titleStyle = css({
  textStyle: 'h3',
  color: 'gray.900',
});

const deleteAllButtonStyle = css({
  textStyle: 'body2.m',
  color: 'gray.400',
  textDecoration: 'underline',
  // 지정값으로 주면 너무 붙어보여서 좀 늘렸습니다
  textUnderlineOffset: '0.5rem',
  cursor: 'pointer',
  transition: 'color 0.3s',
});
