'use client';

import { useEffect, useMemo, useState } from 'react';
import { css } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { FilterChipGroup } from '@/features/home/components/FilterChipGroup';
import { Calendar } from '@/features/home/components/Calendar';
import { AssignmentSection } from '@/features/home/components/AssignmentSection';
import { useHomeTaskList } from '@/hooks/queries/useHomeTaskList';
import { useHomeFilterStore } from '@/stores/home-filter-store';
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
  const selectedFolderIds = useHomeFilterStore(
    (state) => state.selectedFolderIds,
  );
  const setSelectedFolderIds = useHomeFilterStore(
    (state) => state.setSelectedFolderIds,
  );

  // 처음에는 모든 폴더가 선택되어 있음
  const allFolderIds = useMemo(
    () => [...new Set(assignments.map((a) => a.folderId))],
    [assignments],
  );
  // 정렬 변경 시 기존 선택 유지, 초기 로드 시 전체 선택
  const effectiveSelectedIds = useMemo(() => {
    if (selectedFolderIds === null) return allFolderIds;
    const validIds = new Set(allFolderIds);
    const kept = selectedFolderIds.filter((id) => validIds.has(id));
    return kept.length > 0 ? kept : allFolderIds;
  }, [selectedFolderIds, allFolderIds]);

  useEffect(() => {
    if (selectedFolderIds === null) return;
    if (!data || allFolderIds.length === 0) return;

    const validIds = new Set(allFolderIds);
    const kept = selectedFolderIds.filter((id) => validIds.has(id));
    const hasChanged =
      kept.length !== selectedFolderIds.length ||
      kept.some((id, index) => id !== selectedFolderIds[index]);

    if (hasChanged) {
      setSelectedFolderIds(kept.length > 0 ? kept : null);
    }
  }, [data, selectedFolderIds, allFolderIds, setSelectedFolderIds]);

  return (
    <div className={containerStyle}>
      {/* 폴더 필터 바 */}
      <FilterChipGroup
        assignments={assignments}
        selectedIds={effectiveSelectedIds}
        onSelectionChange={setSelectedFolderIds}
      />

      {/* 캘린더 + 과제목록 */}
      <div className={mainStyle}>
        {/* 캘린더 */}
        <div className={calendarStyle}>
          <Calendar
            assignments={assignments}
            subTasks={subTasks}
            selectedFolderIds={effectiveSelectedIds}
          />
        </div>

        {/* 과제목록 (마감 지나지 않은 과제만) */}
        <AssignmentSection
          assignments={assignments.filter((a) => !a.dDay.includes('+'))}
          sortType={sortType}
          onSortChange={setSortType}
        />
      </div>
    </div>
  );
};

const containerStyle = css(
  stack.raw({
    gap: '1rem',
  }),
);

const mainStyle = css(
  hstack.raw({
    gap: '1.5rem',
    alignItems: 'flex-start',
    width: '100%',
  }),
);

const calendarStyle = css({
  width: '45.9375rem',
  minHeight: '44rem',
});
