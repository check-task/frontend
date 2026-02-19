'use client';

import { useParams } from 'next/navigation';
import { Divider } from '@/components/Divider';
import { TeamHeader } from '@/features/assignment/team/components/TeamHeader';
import { TeamHeaderButton } from '@/features/assignment/team/components/TeamHeaderButtonGroup';
import { TeamEtc } from '@/features/assignment/team/components/TeamEtc';
import TeamTaskList from '@/features/assignment/team/components/TeamTaskList';
import { css } from 'styled-system/css';
import { useTeamTaskDetail } from '@/features/assignment/team/components/hooks/useTeamTaskDetail';
import { useTaskRoomSocket } from '@/features/assignment/team/hooks/useTaskRoomSocket';
import { useUIStore } from '@/stores/ui-store';

const TEAM_PAGE_WIDTH_EXPANDED = '70.125rem';
const TEAM_PAGE_WIDTH_COLLAPSED = '75rem';

export default function TeamAssignmentDetailPage() {
  const params = useParams();
  const taskId = Number(params?.id);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const containerWidth = isSidebarCollapsed
    ? TEAM_PAGE_WIDTH_COLLAPSED
    : TEAM_PAGE_WIDTH_EXPANDED;
  const { data, isLoading, isError, error } = useTeamTaskDetail(taskId);

  useTaskRoomSocket(taskId);

  if (isLoading || !data) {
    return (
      <div className={containerStyle} style={{ width: containerWidth }}>
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
      <div className={containerStyle} style={{ width: containerWidth }}>
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
    <div className={containerStyle} style={{ width: containerWidth }}>
      <div className={headerContainerStyle}>
        <TeamHeader
          title={data.title}
          daysLeft={data.dDay}
          completionRate={data.progressRate}
          folderColorHex={data.foldercolor}
        />
        <TeamHeaderButton taskId={data.taskId} />
      </div>

      <div className={taskContainerStyle}>
        <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
          TASK 목록
        </h2>
        <TeamTaskList
          taskId={data.taskId}
          subTasks={data.subTasks}
          maxDate={data.deadline}
        />
      </div>

      <Divider className={css({ mt: '3.75rem', mb: '3.75rem' })} />

      <TeamEtc
        taskId={data.taskId}
        references={data.references}
        communications={data.communications}
        meetingLogs={data.meetingLogs}
      />
    </div>
  );
}

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  pt: '2.5rem',
  pb: '3.75rem',
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
