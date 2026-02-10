'use client';

import { useEffect, useRef, useState } from 'react';
import { css, cva } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { AlarmCard } from './AlarmCard';
import type { AlarmListItem } from '@/types/alarm';
import { useUIStore } from '@/stores/ui-store';
import { AlarmAllClearButton } from './AlarmAllClearButton';
import { useInfiniteAlarmList } from '@/hooks/queries/useInfiniteAlarmList';

const PAGE_SIZE = 10;

export const AlarmListContainer = () => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteAlarmList({
      limit: PAGE_SIZE, // 10개씩
      order: 'desc',
    });

  const [hiddenAlarmIds, setHiddenAlarmIds] = useState<Set<number>>(new Set());
  // 무한 스크롤 감지를 위한 Dom 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 중복 제거
  const uniqueById = (items: AlarmListItem[]) =>
    Array.from(new Map(items.map((item) => [item.alarmId, item])).values());

  const alarms = uniqueById(
    data?.pages.flatMap((page) => page.alarmList) ?? [],
  );
  const visibleAlarms = alarms.filter(
    (alarm) => !hiddenAlarmIds.has(alarm.alarmId),
  );

  // 무한 스크롤 구현
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 개별 알림 삭제 함수
  const handleDelete = (alarmId: number) => {
    setHiddenAlarmIds((prev) => {
      const next = new Set(prev);
      next.add(alarmId);
      return next;
    });
  };

  // 모든 알림 삭제 함수
  const handleClearAll = () => {
    if (alarms.length === 0) {
      return;
    }

    setHiddenAlarmIds(new Set(alarms.map((alarm) => alarm.alarmId)));
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
      {isLoading ? (
        <div>불러오는 중...</div>
      ) : visibleAlarms.length === 0 ? (
        <div>알림이 없습니다.</div>
      ) : (
        <div className={flex({ direction: 'column', gap: '1rem' })}>
          {visibleAlarms.map((alarm) => (
            <AlarmCard
              key={alarm.alarmId}
              {...alarm}
              onDelete={() => handleDelete(alarm.alarmId)}
            />
          ))}
        </div>
      )}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && <div>불러오는 중...</div>}
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
