'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { useUIStore } from '@/stores/ui-store';
import { css } from 'styled-system/css';
import { TeamMemberManageModal } from './TeamMemberManageModal';
import { ConfirmDeleteAssignmentDataModal } from '@/features/assignment/components/ConfirmDeleteAssginmentDataModal';
import { useDeleteTask } from '@/hooks/mutations/useDeleteTask';
import { useRouter } from 'next/navigation';

interface TeamHeaderButtonProps {
  taskId: number;
  title?: string;
}

export const TeamHeaderButton = ({ taskId, title }: TeamHeaderButtonProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();
  const { mutateAsync: deleteTask } = useDeleteTask(taskId);
  const router = useRouter();

  const handleTeamMemberManageClick = () => {
    openModal({
      title: '팀원 관리',
      content: <TeamMemberManageModal taskId={taskId} />,
    });
  };

  const handleDeleteTaskClick = () => {
    openModal({
      title: '과제 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={title || '과제'}
          onConfirm={async () => {
            await deleteTask();
            closeModal();
            router.push('/assignment?type=team');
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const btnSize = isSidebarCollapsed ? 'small' : 'tiny';

  return (
    <div
      className={css({
        display: 'flex',
        gap: '1.25rem',
      })}
    >
      <Button
        variant='strokeBlue'
        size={btnSize}
        className={css({ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' })}
        onClick={handleTeamMemberManageClick}
      >
        팀원관리
      </Button>
      <Button
        variant='strokeBlue'
        size={btnSize}
        className={css({ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' })}
        onClick={handleDeleteTaskClick}
      >
        과제삭제
      </Button>
    </div>
  );
};
