'use client';

import { useParams } from 'next/navigation';
import { Divider } from '@/components/Divider';
import { AssignmentHeader } from '@/features/assignment/components/AssignmentHeader';
import { TeamHeaderButton } from '@/features/assignment/team/components/TeamHeaderButtonGroup';
import { TeamEtc } from '@/features/assignment/team/components/TeamEtc';
import TeamTaskList from '@/features/assignment/team/components/TeamTaskList';
import { css } from 'styled-system/css';
import { useTeamTaskDetail } from '@/features/assignment/team/components/hooks/useTeamTaskDetail';
import { useTaskRoomSocket } from '@/features/assignment/team/hooks/useTaskRoomSocket';
import { useUIStore } from '@/stores/ui-store';

const HEADER_WIDTH_COLLAPSED = '49.5625rem'; // 사이드바 닫힘 (793px)
const HEADER_WIDTH_EXPANDED = '43.25rem';  // 사이드바 열림 (692px)
const CONTENT_WIDTH_COLLAPSED = '75rem';   // 사이드바 닫힘 (1200px)
const CONTENT_WIDTH_EXPANDED = '70.125rem'; // 사이드바 열림 (1122px)

export default function TeamAssignmentDetailPage() {
  const params = useParams();
  const taskId = Number(params?.id);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const headerWidth = isSidebarCollapsed ? HEADER_WIDTH_COLLAPSED : HEADER_WIDTH_EXPANDED;
  const contentWidth = isSidebarCollapsed ? CONTENT_WIDTH_COLLAPSED : CONTENT_WIDTH_EXPANDED;
  const { data, isLoading, isError, error } = useTeamTaskDetail(taskId);

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
        <div className={headerContainerStyle}>
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
