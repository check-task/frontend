'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Divider } from '@/components/Divider';
import { AssignmentHeader } from '@/features/assignment/components/AssignmentHeader';
import { TeamHeaderButton } from '@/features/assignment/team/components/TeamHeaderButtonGroup';
import { TeamEtc } from '@/features/assignment/team/components/TeamEtc';
import TeamTaskList from '@/features/assignment/team/components/TeamTaskList';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { FormActionButtons } from '@/features/assignment/components/FormActionButtons';
import { css } from 'styled-system/css';
import { useTeamTaskDetail } from '@/features/assignment/team/components/hooks/useTeamTaskDetail';
import { useTaskRoomSocket } from '@/features/assignment/team/hooks/useTaskRoomSocket';
import { useUIStore } from '@/stores/ui-store';
import { useModalStore } from '@/stores/modal-store';
import { DeleteAllTaskConfirmModal } from '@/features/assignment/components/DeleteAllTaskConfirmModal';
import { useDeleteAllSubTasks } from '@/features/assignment/hooks/useDeleteAllSubTasks';
import { useDeleteSubTasks } from '@/features/assignment/hooks/useDeleteSubTasks';
import { UndoToast } from '@/components/UndoToast';
import type { TaskDetailSubTask } from '@/types/task';

const HEADER_WIDTH_COLLAPSED = '49.5625rem'; // 사이드바 닫힘 (793px)
const HEADER_WIDTH_EXPANDED = '43.25rem';  // 사이드바 열림 (692px)
const CONTENT_WIDTH_COLLAPSED = '75rem';   // 사이드바 닫힘 (1200px)
const CONTENT_WIDTH_EXPANDED = '70.125rem'; // 사이드바 열림 (1122px)

export default function TeamAssignmentDetailPage() {
  const params = useParams();
  const taskId = Number(params?.id);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();
  const headerWidth = isSidebarCollapsed ? HEADER_WIDTH_COLLAPSED : HEADER_WIDTH_EXPANDED;
  const contentWidth = isSidebarCollapsed ? CONTENT_WIDTH_COLLAPSED : CONTENT_WIDTH_EXPANDED;
  const { data, isLoading, isError, error } = useTeamTaskDetail(taskId);
  const { mutate: mutateDeleteAll } = useDeleteAllSubTasks(taskId);
  const { mutate: mutateDeleteBulk } = useDeleteSubTasks(taskId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitles, setEditedTitles] = useState<Record<number, string>>({});
  const [deletedSubTaskIds, setDeletedSubTaskIds] = useState<Set<number>>(new Set());
  const [undoSnapshot, setUndoSnapshot] = useState<TaskDetailSubTask | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  const enterEditMode = () => {
    setIsEditMode(true);
    setEditedTitles({});
    setDeletedSubTaskIds(new Set());
  };

  const exitEditMode = (keepDeletedIds = false) => {
    setIsEditMode(false);
    setEditedTitles({});
    if (!keepDeletedIds) setDeletedSubTaskIds(new Set());
    setShowUndoToast(false);
    setUndoSnapshot(null);
  };

  const handleTitleChange = (subTaskId: number, title: string) => {
    setEditedTitles((prev) => ({ ...prev, [subTaskId]: title }));
  };

  const handleDeleteTask = useCallback((subTaskId: number) => {
    const target = data?.subTasks.find((t) => t.subTaskId === subTaskId);
    if (target) {
      setUndoSnapshot(target);
      setShowUndoToast(true);
    }
    setDeletedSubTaskIds((prev) => new Set(prev).add(subTaskId));
  }, [data?.subTasks]);

  const handleUndo = useCallback(() => {
    if (undoSnapshot) {
      setDeletedSubTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(undoSnapshot.subTaskId);
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

  const handleSave = () => {
    const ids = Array.from(deletedSubTaskIds);
    if (ids.length > 0) {
      mutateDeleteBulk(ids, { onSuccess: () => exitEditMode(true) });
    } else {
      // TODO: 제목 수정 API 연동 (editedTitles)
      exitEditMode();
    }
  };

  const handleDeleteAll = () => {
    openModal({
      title: '세부 과제 삭제',
      headerType: 'none',
      content: (
        <DeleteAllTaskConfirmModal
          onConfirm={() => {
            mutateDeleteAll(undefined, {
              onSuccess: () => {
                exitEditMode();
                closeModal();
              },
            });
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  useTaskRoomSocket(taskId);

  if (isLoading || !data) {
    return (
      <div className={outerContainerStyle}>
        <div
          className={css({
            py: '3rem',
            textStyle: 'body1.m',
            color: 'gray.600',
          })}
        >
          {isLoading ? '로딩 중...' : '과제 정보를 불러올 수 없습니다.'}
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      (error as { response?: { data?: { reason?: string } } })?.response?.data
        ?.reason ?? '과제를 찾을 수 없습니다.';
    return (
      <div className={outerContainerStyle}>
        <div
          className={css({
            py: '3rem',
            textStyle: 'body1.m',
            color: 'red.500',
          })}
        >
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={outerContainerStyle}>
      <div
        style={{ width: contentWidth, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        className={innerContainerStyle}
      >
        <div
          className={headerContainerStyle}
          style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
        >
          <div
            style={{
              width: headerWidth,
              flexShrink: 0,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <AssignmentHeader
              title={data.title}
              daysLeft={data.dDay}
              completionRate={data.progressRate}
              folderColorHex={data.foldercolor}
            />
          </div>
          <TeamHeaderButton taskId={data.taskId} />
        </div>

        <div className={taskContainerStyle}>
          <div className={taskHeaderStyle}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
              <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
                세부 TASK
              </h2>
              {!isEditMode && (
                <button
                  type='button'
                  onClick={enterEditMode}
                  className={css({cursor: 'pointer'})}
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
          <TeamTaskList
            taskId={data.taskId}
            subTasks={data.subTasks.filter((t) => !deletedSubTaskIds.has(t.subTaskId))}
            maxDate={data.deadline}
            isEditMode={isEditMode}
            editedTitles={editedTitles}
            onTitleChange={handleTitleChange}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <div style={isEditMode ? { opacity: 0.4, pointerEvents: 'none', width: '100%' } : undefined}>
          <Divider className={css({ mt: '3.75rem', mb: '3.75rem' })} />
          <TeamEtc
            taskId={data.taskId}
            references={data.references}
            communications={data.communications}
            meetingLogs={data.meetingLogs}
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
}

// 개인 페이지 containerStyle과 동일한 구조: 전체 너비에서 내부를 중앙 정렬
const outerContainerStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  py: '2.5rem',
  pb: '3.75rem',
});

// 개인 페이지 contentGridStyle에 대응: 고정 너비 + 세로 스택
const innerContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
});

const headerContainerStyle = css({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

const taskContainerStyle = css({
  pt: '2.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
});

const taskHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

