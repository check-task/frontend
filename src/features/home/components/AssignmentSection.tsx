'use client';

import { styled } from 'styled-system/jsx';
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
    <Container css={{ width: isSidebarCollapsed ? '27.375rem' : '22.75rem' }}>
      <Header>
        <Title>과제목록</Title>
        <SortTabs activeTab={sortType} onTabChange={onSortChange} />
      </Header>
      <AssignmentCardList
        assignments={assignments}
        isDragDisabled={sortType !== 'priority'} // 우선순위 탭이 아닌 경우 드래그앤드롭 비활성화
      />
    </Container>
  );
};

const Container = styled('div', {
  base: stack.raw({
    gap: '1.25rem',
    transition: 'width 0.3s ease',
  }),
});

const Header = styled('div', {
  base: hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
});

const Title = styled('h4', {
  base: {
    textStyle: 'h4',
    color: 'gray.900',
  },
});
