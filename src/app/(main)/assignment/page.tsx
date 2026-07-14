'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { AssignmentList } from '@/components/AssignmentList';
import { FolderFilterDropdown } from '@/components/FolderFilterDropdown';
import { useTaskList } from '@/features/assignment/hooks/useTaskList';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

export default function AssignmentPage() {
  const { data: myInfo } = useMyInfo();
  const folders = myInfo?.folders ?? [];
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[] | null>(
    null,
  );
  // 과제 목록 데이터 가져오기
  const { data = [], isLoading } = useTaskList(selectedFolderIds);

  return (
    <div
      className={css({
        marginX: 'auto',
        my: '3.25rem',
      })}
    >
      <div className={headerStyle}>
        <h3 className={titleStyle}>내 과제</h3>
        <FolderFilterDropdown
          folders={folders}
          onSelectionChange={setSelectedFolderIds}
        />
      </div>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <AssignmentList assignments={data} />
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
