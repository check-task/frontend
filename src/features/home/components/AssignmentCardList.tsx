'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from 'styled-system/css';
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
  onClick,
}: {
  assignment: Assignment;
  index: number;
  disabled?: boolean;
  onClick: () => void;
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
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
  const router = useRouter();
  const updatePriorities = useUpdateTaskPriorities();
  // 드래그 시 즉각적인 UI 반영을 위한 로컬 상태
  const [items, setItems] = useState(assignments);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setItems(assignments);
  }, [assignments]);

  const sensors = useSensors(
    // 마우스/터치 감지 (distance: 5로 클릭과 드래그 구분)
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    // 접근성을 위한 키보드 감지
    // Tab으로 카드 선택 후 Space/Enter로 드래그 시작
    // 방향키로 위치로 이동 후 Space/Enter로 드롭
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeItem = items.find((a) => a.id === activeId);

  const handleCardClick = (assignment: Assignment) => {
    const type = assignment.assignmentType === '팀' ? 'team' : 'personal';
    router.push(`/assignment/${type}/${assignment.id}`);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  // 드래그 완료 시 카드 순서 재정렬 + 우선순위 API 호출
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);

      // 즉시 로컬 상태 반영
      setItems(reordered);

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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={items.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={containerStyle}>
          {items.map((assignment, index) => (
            <SortableAssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={index}
              disabled={isDragDisabled}
              onClick={() => handleCardClick(assignment)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {activeItem && (
          <div style={{ cursor: 'grabbing' }}>
            <AssignmentCard
              folderName={activeItem.folderName}
              folderColor={activeItem.folderColor}
              dDay={activeItem.dDay}
              assignmentName={activeItem.assignmentName}
              assignmentType={activeItem.assignmentType}
              progress={activeItem.progress}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

const containerStyle = css(
  stack.raw({
    gap: '0.75rem',
  }),
);
