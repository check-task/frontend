'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { FilterChipGroup } from '@/features/home/components/FilterChipGroup';
import { Calendar } from '@/features/home/components/Calendar';
import { AssignmentSection } from '@/features/home/components/AssignmentSection';
import type { FolderColor } from '@/types/folder';

// 과제 타입
interface Assignment {
  id: string;
  folderId: string;
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  dueDate: string;
  assignmentName: string;
  assignmentType: string;
  progress: number;
}

interface HomeContentProps {
  assignments: Assignment[];
}

export const HomeContent = ({ assignments }: HomeContentProps) => {
  // 처음에는 모든 폴더가 선택되어 있음
  const allFolderIds = [
    ...new Set(assignments.map((assignment) => assignment.folderId)),
  ];
  const [selectedFolderIds, setSelectedFolderIds] =
    useState<string[]>(allFolderIds);

  return (
    <>
      {/* 폴더 필터 바 */}
      <FilterChipGroup
        assignments={assignments}
        selectedIds={selectedFolderIds}
        onSelectionChange={setSelectedFolderIds}
      />

      {/* 캘린더 + 과제목록 */}
      <Container.Main>
        {/* 캘린더 */}
        <Container.Calendar>
          <Calendar
            assignments={assignments}
            selectedFolderIds={selectedFolderIds}
          />
        </Container.Calendar>

        {/* 과제목록 */}
        <AssignmentSection initialAssignments={assignments} />
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
      height: '44rem',
      border: '0.0625rem solid',
      borderColor: 'gray.200',
      borderRadius: '0.75rem',
      boxShadow: '-1px 1px 4px 0 rgba(0, 0, 0, 0.08)',
    },
  }),
};
