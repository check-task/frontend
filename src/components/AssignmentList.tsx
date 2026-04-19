'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { stack } from 'styled-system/patterns';
import { css } from 'styled-system/css';
import { AssignmentCard } from '@/components/AssignmentCard';
import { TaskToggle } from '@/components/TaskToggle';
import { FolderColor } from '@/types/folder';
import { TaskListItem } from '@/features/assignment/hooks/useTaskList';

// ======== 타입 정의 ========
interface AssignmentListProps {
  assignments: TaskListItem[];
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
  const [currentTab, setCurrentTab] = useState<'personal' | 'team'>('personal');

  // url에서 현재 토글 상태 가져오기 (hydration mismatch 방지)
  useEffect(() => {
    const nextTab =
      (searchParams.get('type') as 'personal' | 'team') || 'personal';
    setCurrentTab(nextTab);
  }, [searchParams]);

  // 토글 변경 시 호출되는 함수
  const handleToggle = (type: 'personal' | 'team') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    setCurrentTab(type);
    router.push(`?${params.toString()}`);
  };

  // 카드 컴포넌트 클릭 시 상세 페이지 이동 함수
  const handleCardClick = (id: number, type: 'personal' | 'team') => {
    const path = type === 'personal' ? 'personal' : 'team';
    router.push(`/assignment/${path}/${id}`);
  };

  // 토글 상태에 따라 분리
  const filtered = assignments.filter((item) => item.type === currentTab);

  // 토글 상태에 따라 개수 카운트
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
        {filtered.map((item) => {
          const { id, ...cardProps } = item;
          return (
            <AssignmentCard
              key={id}
              {...cardProps}
              dateType={isDone ? 'date' : 'dday'}
              onClick={() => handleCardClick(id, item.type)}
            />
          );
        })}
      </div>
    </>
  );
}

// 내보낼 컴포넌트
export function AssignmentList(props: AssignmentListProps) {
  return (
    <Suspense>
      <AssignmentListContent {...props} />
    </Suspense>
  );
}
