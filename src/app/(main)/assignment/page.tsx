'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { css } from 'styled-system/css';
import { AssignmentList } from '@/components/AssignmentList';
import { FolderFilterDropdown } from '@/components/FolderFilterDropdown';
import { useTaskList } from '@/features/assignment/hooks/useTaskList';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

function AssignmentPageContent() {
  const searchParams = useSearchParams();
  const folderIdParam = searchParams.get('folderId');
  const parsedFolderId = folderIdParam ? Number(folderIdParam) : NaN;
  const initialFolderId = Number.isSafeInteger(parsedFolderId)
    ? parsedFolderId
    : null;

  const { data: myInfo } = useMyInfo();
  const folders = myInfo?.folders ?? [];
  // 마이페이지에서 폴더 클릭 시 넘어온 folderId로 초기 필터 지정
  const [prevInitialFolderId, setPrevInitialFolderId] = useState(initialFolderId);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[] | null>(
    () => (initialFolderId != null ? [initialFolderId] : null),
  );
  // 같은 페이지에서 URL의 folderId만 바뀌는 경우 대비, 렌더 중 동기화
  if (initialFolderId !== prevInitialFolderId) {
    setPrevInitialFolderId(initialFolderId);
    setSelectedFolderIds(initialFolderId != null ? [initialFolderId] : null);
  }
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
          initialFolderId={initialFolderId}
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

export default function AssignmentPage() {
  return (
    <Suspense>
      <AssignmentPageContent />
    </Suspense>
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
