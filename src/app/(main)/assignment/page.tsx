'use client';

import { css } from 'styled-system/css';
import { AssignmentList } from '@/components/AssignmentList';
import { useTaskList } from '@/features/assignment/hooks/useTaskList';

export default function AssignmentPage() {
  // 과제 목록 데이터 가져오기
  const { data = [], isLoading } = useTaskList();

  return (
    // 전체 컨테이너
    <div
      className={css({
        my: '3.25rem',
      })}
    >
      <h3 className={titleStyle}>내 과제</h3>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <AssignmentList assignments={data} />
      )}
    </div>
  );
}

// ======== 스타일 정의 ========
const titleStyle = css({
  textStyle: 'h3',
  mb: '0.75rem',
  color: 'gray.900',
});
