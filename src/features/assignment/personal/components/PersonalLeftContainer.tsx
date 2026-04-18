'use client';

import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { AssignmentHeader } from '@/features/assignment/components/AssignmentHeader';
import { PersonalTaskList, type PersonalTaskItem } from './PersonalTaskList';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { FormActionButtons } from '@/features/assignment/components/FormActionButtons';
import { useModalStore } from '@/stores/modal-store';
import { DeleteAllTaskConfirmModal } from '@/features/assignment/components/DeleteAllTaskConfirmModal';
import { useState, useCallback } from 'react';
import { useDeleteAllSubTasks } from '@/features/assignment/hooks/useDeleteAllSubTasks';
import { useDeleteSubTasks } from '@/features/assignment/hooks/useDeleteSubTasks';
import { useUpdateSubTasksBatch } from '@/features/assignment/hooks/useUpdateSubTasksBatch';
import { UndoToast } from '@/components/UndoToast';
import { useAlertStore } from '@/stores/alert-store';

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

  const { mutate: mutateDeleteAll } = useDeleteAllSubTasks(taskId);
  const { mutate: mutateDeleteBulk } = useDeleteSubTasks(taskId);
  const { mutate: mutateUpdateBatch } = useUpdateSubTasksBatch(taskId);
  const showAlert = useAlertStore((state) => state.showAlert);

  // 되돌리기를 위해 task 저장
  const [undoSnapshot, setUndoSnapshot] = useState<PersonalTaskItem | null>(
    null,
  );
  const [showUndoToast, setShowUndoToast] = useState(false);

  const enterEditMode = () => {
    onEditModeChange?.(true);
    setEditedTitles({});
    setDeletedTaskIds(new Set());
  };

  const exitEditMode = (keepDeletedIds = false) => {
    onEditModeChange?.(false);
    setEditedTitles({});
    if (!keepDeletedIds) setDeletedTaskIds(new Set());
    setShowUndoToast(false);
    setUndoSnapshot(null);
  };

  const handleSave = () => {
    if (Object.values(editedTitles).some((title) => title.trim() === '')) {
      showAlert('세부과제명을 입력하세요.', 'x');
      return;
    }

    const ids = Array.from(deletedTaskIds);

    const changedSubTasks = Object.entries(editedTitles)
      .filter(([id, title]) => {
        const original = tasks.find((t) => t.id === Number(id));
        return original && original.title !== title && title.trim() !== '';
      })
      .map(([id, title]) => {
        const task = tasks.find((t) => t.id === Number(id))!;
        return {
          subTaskId: Number(id),
          title,
          deadline: task.deadline,
          isAlarm: task.isAlarm,
        };
      });

    const hasDeletes = ids.length > 0;
    const hasUpdates = changedSubTasks.length > 0;

    if (hasDeletes && hasUpdates) {
      mutateDeleteBulk(ids, {
        onSuccess: () =>
          mutateUpdateBatch(changedSubTasks, {
            onSuccess: () => exitEditMode(true),
          }),
      });
    } else if (hasDeletes) {
      mutateDeleteBulk(ids, { onSuccess: () => exitEditMode(true) });
    } else if (hasUpdates) {
      mutateUpdateBatch(changedSubTasks, { onSuccess: () => exitEditMode() });
    } else {
      exitEditMode();
    }
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

  const confirmDeleteAll = () => {
    mutateDeleteAll(undefined, {
      onSuccess: () => {
        exitEditMode();
        closeModal();
      },
    });
  };

  const handleTitleChange = (id: number, title: string) => {
    setEditedTitles((prev) => ({ ...prev, [id]: title }));
  };

  const handleDeleteTask = useCallback(
    (id: number) => {
      const target = tasks.find((t) => t.id === id);
      if (target) {
        setUndoSnapshot(target);
        setShowUndoToast(true);
      }
      setDeletedTaskIds((prev) => new Set(prev).add(id));
    },
    [tasks],
  );

  const handleUndo = useCallback(() => {
    if (undoSnapshot) {
      setDeletedTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(undoSnapshot.id);
        return next;
      });
    }
    setShowUndoToast(false);
    setUndoSnapshot(null);
  }, [undoSnapshot]);

  const handleToastClose = useCallback(() => {
    setShowUndoToast(false);
    setUndoSnapshot(null);
  }, []);

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
            taskId={taskId}
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
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              })}
            >
              <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
                세부 TASK
              </h2>
              {!isEditMode && (
                <button
                  type='button'
                  onClick={enterEditMode}
                  className={css({ cursor: 'pointer' })}
                  aria-label='세부 task 수정'
                >
                  <PencilIcon size={24} />
                </button>
              )}
            </div>
            <div
              className={css({ visibility: isEditMode ? 'visible' : 'hidden' })}
            >
              <FormActionButtons
                onSave={handleSave}
                onCancel={() => exitEditMode()}
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

      {showUndoToast && (
        <UndoToast
          message={`'${undoSnapshot?.title}' 세부 과제가 삭제됩니다.`}
          onUndo={handleUndo}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition:
      'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
