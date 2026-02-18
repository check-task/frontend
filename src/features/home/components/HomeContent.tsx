'use client';

import { useState, useMemo } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { FilterChipGroup } from '@/features/home/components/FilterChipGroup';
import { Calendar } from '@/features/home/components/Calendar';
import { AssignmentSection } from '@/features/home/components/AssignmentSection';
import { useHomeTaskList } from '@/hooks/queries/useHomeTaskList';
import type { SortType } from '@/features/home/components/SortTabs';
import type { TaskSort } from '@/types/task';

// SortTabs의 SortType → 백엔드 TaskSort 매핑
const SORT_MAP: Record<SortType, TaskSort> = {
  priority: 'PRIORITY',
  deadline: 'DEADLINE',
  progress: 'PROGRESSRATE',
};

export const HomeContent = () => {
  const [sortType, setSortType] = useState<SortType>('priority');
  const { data } = useHomeTaskList(SORT_MAP[sortType]);
  const assignments = useMemo(() => data?.assignments ?? [], [data]);
  const subTasks = useMemo(() => data?.subTasks ?? [], [data]);

  // 처음에는 모든 폴더가 선택되어 있음
  const allFolderIds = useMemo(
    () => [...new Set(assignments.map((a) => a.folderId))],
    [assignments],
  );
  // 유저가 직접 토글한 선택 상태
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[] | null>(
    null,
  );

  // 정렬 변경 시 기존 선택 유지, 초기 로드 시 전체 선택
  const effectiveSelectedIds = useMemo(() => {
    if (selectedFolderIds === null) return allFolderIds;
    const validIds = new Set(allFolderIds);
    const kept = selectedFolderIds.filter((id) => validIds.has(id));
    return kept.length > 0 ? kept : allFolderIds;
  }, [selectedFolderIds, allFolderIds]);

  return (
    <>
      {/* 폴더 필터 바 */}
      <FilterChipGroup
        assignments={assignments}
        selectedIds={effectiveSelectedIds}
        onSelectionChange={setSelectedFolderIds}
      />

      {/* 캘린더 + 과제목록 */}
      <Container.Main>
        {/* 캘린더 */}
        <Container.Calendar>
          <Calendar
            assignments={assignments}
            subTasks={subTasks}
            selectedFolderIds={effectiveSelectedIds}
          />
        </Container.Calendar>

        {/* 과제목록 (마감 지나지 않은 과제만) */}
        <AssignmentSection
          assignments={assignments.filter((a) => !a.dDay.includes('+'))}
          sortType={sortType}
          onSortChange={setSortType}
        />
      </Container.Main>
    </>
  );
};

const Container = {
  Main: styled('div', {
    base: hstack.raw({
      gap: '1.5rem',
      alignItems: 'flex-start',
      width: '100%',
    }),
  }),
  Calendar: styled('div', {
    base: {
      width: '45.9375rem',
      minHeight: '44rem',
      border: '0.0625rem solid',
      borderColor: 'gray.200',
      borderRadius: '0.75rem',
      boxShadow: '-1px 1px 4px 0 rgba(0, 0, 0, 0.08)',
    },
  }),
};
