'use client';

import { css } from 'styled-system/css';
import { useParams } from 'next/navigation';
import { PersonalLeftContainer } from '@/features/assignment/personal/components/PersonalLeftContainer';
import { PersonalRightContainer } from '@/features/assignment/personal/components/PersonalRightContainer';
import { usePersonalTaskDetail } from '@/features/assignment/personal/components/hooks/usePersonalTaskDetail';

export default function PersonalPage() {
  const params = useParams();
  const taskId = Number(params?.id);
  // 개인 과제 상세 커스텀 훅 호출
  const { data, isLoading } = usePersonalTaskDetail(taskId);

  if (isLoading || !data) {
    return (
      <div className={containerStyle}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <div className={contentGridStyle}>
        <PersonalLeftContainer
          taskId={data.taskId}
          title={data.title}
          deadline={data.deadline}
          daysLeft={data.dDay}
          completionRate={data.progressRate}
          tasks={data.tasks}
        />
        <PersonalRightContainer items={data.items} />
      </div>
    </div>
  );
}

// ======== 스타일 정의 ========
const containerStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  py: '3.38rem',
});

// 왼쪽과 오른쪽을 가로로 배치
const contentGridStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: 'fit-content', // 각 컨테이너에서 길이 처리할 예정
});
