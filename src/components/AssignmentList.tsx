'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { stack } from 'styled-system/patterns';
import { css } from 'styled-system/css';
import { AssignmentCard } from '@/components/AssignmentCard';
import { TaskToggle } from '@/components/TaskToggle';
import { FolderColor } from '@/types/folder';

// ======== 타입 정의 ========
// 과제 타입 (토글)
interface AssignmentType {
  type: 'personal' | 'team';
}

// 과제 정보 (카드에 들어가는)
interface AssignmentInfo {
  folderName: string;
  assignmentName: string;
  dueDate: string | number;
  folderColor: FolderColor;
}
export type AssignmentData = AssignmentType & AssignmentInfo & { id: string };

interface AssignmentListProps {
  assignments: AssignmentData[];
  isDone?: boolean; // 진행중인 과제인지 완료된 과제인지
}

// 토글+카드 컴포넌트 공용으로 처리
function AssignmentListContent({
  assignments,
  // 기본을 진행중으로
  isDone = false,
}: AssignmentListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // url에서 현재 토글 상태 가져오기
  const currentTab =
    (searchParams.get('type') as 'personal' | 'team') || 'personal';

  // 토글 변경 시 호출되는 함수
  const handleToggle = (type: 'personal' | 'team') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    router.push(`?${params.toString()}`);
  };

  // 카드 컴포넌트 클릭 시 상세 페이지 이동 함수
  const handleCardClick = (id: string, type: 'personal' | 'team') => {
    // 완료 상태면 상세 페이지로 이동하지 않음
    if (isDone) return;
    const path = type === 'personal' ? 'personal' : 'team';
    router.push(`/assignment/${path}/${id}`);
  };

  // 더미 데이터에서 토글 상태에 따라 분리
  const filtered = assignments.filter((item) => item.type === currentTab);
  // 더미 데이터에서 토글 상태에 따라 개수 카운트
  const personalCount = assignments.filter((d) => d.type === 'personal').length;
  const teamCount = assignments.filter((d) => d.type === 'team').length;

  return (
    <>
      <div className={css({ width: 'full', mb: '1.25rem' })}>
        <TaskToggle
          personalCount={personalCount}
          teamCount={teamCount}
          onToggle={handleToggle}
          selectedType={currentTab}
        />
      </div>

      <div className={stack({ gap: '1rem' })}>
        {filtered.map((item) => (
          <AssignmentCard
            key={item.id}
            {...item}
            dateType={isDone ? 'date' : 'dday'}
            onClick={() => handleCardClick(item.id, item.type)}
            className={css({
              // 완료 상태면 커서 모양 변경
              cursor: isDone ? 'default' : 'pointer',
            })}
          />
        ))}
      </div>
    </>
  );
}

// 내보낼 컴포넌트
export function AssignmentList(props: AssignmentListProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AssignmentListContent {...props} />
    </Suspense>
  );
}
