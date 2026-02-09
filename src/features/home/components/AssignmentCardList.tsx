'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';
import { AssignmentCard } from './AssignmentCard';
import { useUpdateTaskPriorities } from '@/hooks/mutations/useUpdateTaskPriorities';
import type { FolderColor } from '@/types/folder';

export interface Assignment {
  id: number;
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  assignmentName: string;
  assignmentType: string;
  progress: number;
}

interface AssignmentCardListProps {
  assignments: Assignment[];
  isDragDisabled?: boolean;
}

// 드래그 가능한 과제 카드 래퍼 컴포넌트
const SortableAssignmentCard = ({
  assignment,
  index,
  disabled,
}: {
  assignment: Assignment;
  index: number;
  disabled?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: assignment.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AssignmentCard
        index={index}
        folderName={assignment.folderName}
        folderColor={assignment.folderColor}
        dDay={assignment.dDay}
        assignmentName={assignment.assignmentName}
        assignmentType={assignment.assignmentType}
        progress={assignment.progress}
      />
    </div>
  );
};

export const AssignmentCardList = ({
  assignments,
  isDragDisabled = false,
}: AssignmentCardListProps) => {
  const updatePriorities = useUpdateTaskPriorities();

  const sensors = useSensors(
    // 마우스/터치 감지
    useSensor(PointerSensor),
    // 접근성을 위한 키보드 감지
    // Tab으로 카드 선택 후 Space/Enter로 드래그 시작
    // 방향키로 위치로 이동 후 Space/Enter로 드롭
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 드래그 완료 시 카드 순서 재정렬 + 우선순위 API 호출
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = assignments.findIndex((item) => item.id === active.id);
      const newIndex = assignments.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(assignments, oldIndex, newIndex);

      // 새 순서로 우선순위 API 호출
      const orderedTasks = reordered.map((item, idx) => ({
        taskId: item.id,
        rank: idx + 1,
      }));
      updatePriorities.mutate(orderedTasks);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={assignments.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <Container>
          {assignments.map((assignment, index) => (
            <SortableAssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={index}
              disabled={isDragDisabled}
            />
          ))}
        </Container>
      </SortableContext>
    </DndContext>
  );
};

const Container = styled('div', {
  base: stack.raw({
    gap: '0.75rem',
  }),
});
