'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { useUIStore } from '@/stores/ui-store';
import { css } from 'styled-system/css';
import { TeamMemberManageModal } from './TeamMemberManageModal';

interface TeamHeaderButtonProps {
  taskId: number;
}

export const TeamHeaderButton = ({ taskId }: TeamHeaderButtonProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const openModal = useModalStore((state) => state.openModal);

  const handleTeamMemberManageClick = () => {
    openModal({
      title: '팀원 관리',
      content: <TeamMemberManageModal taskId={taskId} />,
    });
  };

  return (
    <div
      className={css({
        display: 'flex',
        gap: '1.25rem',
      })}
    >
      <Button
        variant='strokeBlue'
        size={isSidebarCollapsed ? 'small' : 'tiny'}
        className={css({
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        })}
        onClick={handleTeamMemberManageClick}
      >
        팀원관리
      </Button>
    </div>
  );
};
