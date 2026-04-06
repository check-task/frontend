'use client';

import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { AssignmentHeader } from '@/features/assignment/components/AssignmentHeader';
import { PersonalTaskList, type PersonalTaskItem } from './PersonalTaskList';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { FormActionButtons } from '@/features/assignment/components/FormActionButtons';
import { useModalStore } from '@/stores/modal-store';
import { DeleteAllTaskConfirmModal } from '@/features/assignment/components/DeleteAllTaskConfirmModal';
import { useState } from 'react';

interface PersonalLeftContainerProps {
  // 헤더 정보
  title: string;
  deadline: string;
  daysLeft: string;
  completionRate: number;
  folderColorHex?: string;
  taskId: number;
  // task 목록
  tasks: PersonalTaskItem[];
  // 수정 모드 (page 레벨에서 관리)
  isEditMode?: boolean;
  onEditModeChange?: (value: boolean) => void;
}

// 페이지 기준 왼쪽 영역 (헤더+ task 목록)
export const PersonalLeftContainer = ({
  title,
  deadline,
  daysLeft,
  completionRate,
  folderColorHex,
  taskId,
  tasks,
  isEditMode = false,
  onEditModeChange,
}: PersonalLeftContainerProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();

  // 수정 모드 로컬 상태 (편집 중 데이터)
  const [editedTitles, setEditedTitles] = useState<Record<number, string>>({});
  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<number>>(new Set());

  const enterEditMode = () => {
    onEditModeChange?.(true);
    setEditedTitles({});
    setDeletedTaskIds(new Set());
  };

  const exitEditMode = () => {
    onEditModeChange?.(false);
    setEditedTitles({});
    setDeletedTaskIds(new Set());
  };

  const handleSave = () => {
    // TODO: API 연동 (editedTitles로 변경된 제목 저장, deletedTaskIds로 삭제 처리)
    exitEditMode();
  };

  const confirmDeleteAll = () => {
    // TODO: API 연동 (전체 삭제)
    exitEditMode();
    closeModal();
  };

  const handleDeleteAll = () => {
    openModal({
      title: '세부 과제 삭제',
      headerType: 'none',
      content: (
        <DeleteAllTaskConfirmModal
          onConfirm={confirmDeleteAll}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleTitleChange = (id: number, title: string) => {
    setEditedTitles((prev) => ({ ...prev, [id]: title }));
  };

  const handleDeleteTask = (id: number) => {
    setDeletedTaskIds((prev) => new Set(prev).add(id));
  };

  const visibleTasks = tasks.filter((t) => !deletedTaskIds.has(t.id));

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div className={contentWrapperStyle}>
        <div
          style={{
            width: '100%',
            ...(isEditMode && { opacity: 0.4, pointerEvents: 'none' }),
          }}
        >
          <AssignmentHeader
            completionRate={completionRate}
            title={title}
            daysLeft={daysLeft}
            deadline={deadline}
            folderColorHex={folderColorHex}
          />
        </div>

        {/* task 목록 영역 */}
        <div className={taskContainerStyle}>
          {/* 제목 + 연필 아이콘 / 편집 버튼 바 */}
          <div className={taskHeaderStyle({ editMode: isEditMode })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
              <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
                세부 TASK
              </h2>
              {!isEditMode && (
                <button
                  type='button'
                  onClick={enterEditMode}
                  className={pencilButtonStyle}
                  aria-label='세부 task 수정'
                >
                  <PencilIcon size={24} />
                </button>
              )}
            </div>
            <div className={css({ visibility: isEditMode ? 'visible' : 'hidden' })}>
              <FormActionButtons
                onSave={handleSave}
                onCancel={exitEditMode}
                onDeleteAll={handleDeleteAll}
              />
            </div>
          </div>

          <PersonalTaskList
            taskId={taskId}
            tasks={visibleTasks}
            maxDate={deadline}
            isEditMode={isEditMode}
            editedTitles={editedTitles}
            onTitleChange={handleTitleChange}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'all 0.3s ease-in-out',
  },
  variants: {
    collapsed: {
      // 사이드바 닫혀 있음
      true: {
        w: '49.3125rem',
        mr: '1.5rem',
      },
      // 사이드바 열려 있음
      false: {
        w: '43.25rem',
        mr: '1.25rem',
      },
    },
  },
});

const contentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  gap: '2.38rem',
});

const taskContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
});

// 세부 TASK 제목 + 연필/버튼 row
const taskHeaderStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  variants: {
    editMode: {
      true: {},
      false: {},
    },
  },
});

const pencilButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
});
