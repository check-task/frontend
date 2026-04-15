'use client';

import { css } from 'styled-system/css';
import { PersonalEtc } from './PersonalEtc';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { useDeleteTask } from '@/hooks/mutations/useDeleteTask';
import { ConfirmDeleteAssignmentDataModal } from '@/features/assignment/components/ConfirmDeleteAssginmentDataModal';
import { useRouter } from 'next/navigation';

export interface ReferenceItem {
  id: number;
  type: 0 | 1; // 0은 url, 1은 파일로 지정
  name: string;
  path: string;
  fileName?: string;
}

interface PersonalRightContainerProps {
  taskId: number;
  title: string;
  items: ReferenceItem[];
  isEditMode?: boolean;
}

// 페이지 기준 오른쪽 영역 (과제 삭제버튼+자료 모음집)
export const PersonalRightContainer = ({
  taskId,
  title,
  items,
  isEditMode = false,
}: PersonalRightContainerProps) => {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const { mutateAsync: deleteTask } = useDeleteTask(taskId);

  const handleOpenDeleteModal = () => {
    openModal({
      title: '과제 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={title || '과제'}
          onConfirm={async () => {
            await deleteTask();
            closeModal();
            router.push('/assignment');
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <div
      className={containerStyle}
      style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
    >
      <Button
        variant='strokeBlue'
        size='small'
        onClick={handleOpenDeleteModal}
        className={css({ cursor: 'pointer' })}
      >
        과제삭제
      </Button>
      <div style={{ marginTop: '6.75rem' }}>
        <PersonalEtc taskId={taskId} items={items} />
      </div>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  w: '100%',
});
