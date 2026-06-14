'use client';

import { css } from 'styled-system/css';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PersonalLeftContainer } from '@/features/assignment/personal/components/PersonalLeftContainer';
import { PersonalRightContainer } from '@/features/assignment/personal/components/PersonalRightContainer';
import { usePersonalTaskDetail } from '@/features/assignment/personal/components/hooks/usePersonalTaskDetail';
import { useState, useEffect } from 'react';

export default function PersonalPage() {
  const params = useParams();
  const taskId = Number(params?.id);
  // 개인 과제 상세 커스텀 훅 호출
  const { data, isLoading, isError } = usePersonalTaskDetail(taskId);
  // 수정 모드 상태 (오른쪽 영역도 비활성화하기 위해 page 레벨에서 관리)
  const [isEditMode, setIsEditMode] = useState(false);

  if (isError) {
    notFound();
  }

  useEffect(() => {
    if (data?.title) {
      document.title = `${data.title} | CHECKTASK`;
    }
    return () => { document.title = 'CHECKTASK'; };
  }, [data?.title]);

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
          folderColorHex={data.folderColorHex}
          tasks={data.tasks}
          isEditMode={isEditMode}
          onEditModeChange={setIsEditMode}
        />
        <PersonalRightContainer
          taskId={data.taskId}
          title={data.title}
          items={data.items}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
}

// ======== 스타일 정의 ========
const containerStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: 'fit-content',
  py: '3.38rem',
});

// 왼쪽과 오른쪽을 가로로 배치
const contentGridStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: 'fit-content', // 각 컨테이너에서 길이 처리할 예정
});
