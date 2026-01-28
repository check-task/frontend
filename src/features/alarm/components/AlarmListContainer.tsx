'use client';

import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { AlarmCard, AlarmData } from './AlarmCard';
import { useUIStore } from '@/stores/ui-store';
import { AlarmAllClearButton } from './AlarmAllClearButton';

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
  const handleClearAll = () => {
    if (alarms.length > 0) {
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
        <AlarmAllClearButton onClearAll={handleClearAll} />
      </header>

      {/* 알림 카드 리스트 */}
      <div className={flex({ direction: 'column', gap: '1rem' })}>
        {alarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            {...alarm}
            onDelete={() => handleDelete(alarm.id)}
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
