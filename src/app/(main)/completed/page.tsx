'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { AssignmentList } from '@/components/AssignmentList';
import { FolderFilterDropdown } from '@/components/FolderFilterDropdown';
import { useCompletedTaskList } from '@/features/assignment/hooks/useCompletedTaskList';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

export default function CompletedPage() {
  const { data: myInfo } = useMyInfo();
  const folders = myInfo?.folders ?? [];
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[] | null>(
    null,
  );
  const { data = [], isLoading } = useCompletedTaskList(selectedFolderIds);

  return (
    <div className={css({ my: '3.25rem', marginX: 'auto' })}>
      <div className={headerStyle}>
        <h3 className={titleStyle}>완료 과제</h3>
        <FolderFilterDropdown
          folders={folders}
          onSelectionChange={setSelectedFolderIds}
        />
      </div>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <AssignmentList assignments={data} isDone={true} />
      )}
    </div>
  );
}

// ======== 스타일 정의 ========
const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: '1.25rem',
});

const titleStyle = css({
  textStyle: 'h3',
  color: 'gray.900',
});
