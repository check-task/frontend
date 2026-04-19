'use client';

import { css, cva } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { SortTabs, SortType } from './SortTabs';
import { AssignmentCardList, Assignment } from './AssignmentCardList';
import { useUIStore } from '@/stores/ui-store';

interface AssignmentSectionProps {
  assignments: Assignment[];
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

export const AssignmentSection = ({
  assignments,
  sortType,
  onSortChange,
}: AssignmentSectionProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div className={headerStyle}>
        <h4 className={titleStyle}>과제목록</h4>
        <SortTabs activeTab={sortType} onTabChange={onSortChange} />
      </div>
      <AssignmentCardList
        assignments={assignments}
        isDragDisabled={sortType !== 'priority'}
      />
    </div>
  );
};

const containerStyle = cva({
  base: stack.raw({
    gap: '1.25rem',
    transition: 'width 0.3s ease',
  }),
  variants: {
    collapsed: {
      true: { width: '27.375rem' },
      false: { width: '22.75rem' },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const headerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
);

const titleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});
