'use client';

import { css } from 'styled-system/css';
import { AssignmentList } from '@/components/AssignmentList';
import { useCompletedTaskList } from '@/features/assignment/hooks/useCompletedTaskList';

export default function CompletedPage() {
  const { data = [], isLoading } = useCompletedTaskList();

  return (
    <div className={css({ my: '3.25rem' })}>
      <h3 className={titleStyle}>완료 과제</h3>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <AssignmentList assignments={data} isDone={true} />
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
