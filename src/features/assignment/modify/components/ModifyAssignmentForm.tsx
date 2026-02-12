'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { CheckboxHeader } from '../../create/components/CheckboxHeader'; // create있는거 그대로 사용
import { ModifyAssignmentContent } from './ModifyAssignmentContent';
import { ModifyAssignmentTask } from './ModifyAssignmentTask';
import { ModifyAssignmentData } from './ModifyAssignmentData';
import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { useModalStore } from '@/stores/modal-store';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';
import { useSearchParams } from 'next/navigation';
import { useTeamTaskDetail } from '@/features/assignment/team/components/hooks/useTeamTaskDetail';
import { resolveFolderColor } from '@/lib/folder-color';

// 더미 데이터에서 red 값으로 받아서 이를 토큰값으로 변환
// 토큰값으로 변환한건 FolderColor 타입에 맞추기 위해서
const folderColorTokenMap = {
  red: 'sub.01.100',
  yellow: 'sub.02.100',
  green: 'sub.03.100',
  purple: 'sub.04.100',
  black: 'sub.05.100',
} as const;

const getFolderColorToken = (folderColor?: string): string => {
  if (!folderColor) return '';
  if (folderColor in folderColorTokenMap) {
    return folderColorTokenMap[folderColor as keyof typeof folderColorTokenMap];
  }
  if (folderColor.startsWith('#')) {
    const resolved = resolveFolderColor(folderColor);
    return resolved ? folderColorTokenMap[resolved] : '';
  }
  return '';
};

// 과제 수정 전체 컴포넌트
export const ModifyAssignmentForm = () => {
  // 사이드바 상태 가져오기
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();
  const searchParams = useSearchParams();
  const taskId = Number(searchParams?.get('taskId'));
  const { data } = useTeamTaskDetail(taskId);
  const initializedTaskIdRef = useRef<number | null>(null);

  // 과제 수정 페이지이므로 기본값 세팅
  const [assignmentName, setAssignmentName] = useState('');
  const [folderColor, setFolderColor] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!data?.taskId || initializedTaskIdRef.current === data.taskId) return;
    setAssignmentName(data.title ?? '');
    setFolderColor(getFolderColorToken(data.foldercolor));
    setDueDate(data.deadline ? new Date(`${data.deadline}T00:00:00`) : null);
    initializedTaskIdRef.current = data.taskId;
  }, [data]);

  const initialTasks = data?.subTasks?.map((task) => ({
    id: task.subTaskId,
    title: task.title,
    dueDate: task.deadline,
  }));

  const initialDataItems = data?.references?.map((ref, index) => ({
    id: ref.referenceId ?? index + 1,
    type: (ref.file_url ? 1 : 0) as 0 | 1,
    name: ref.name,
    path: ref.url ?? ref.file_url ?? '',
  }));

  const isFormValid = assignmentName.trim() !== '' && folderColor !== '';

  // 과제 삭제 모달 핸들러
  const handleOpenDeleteAssignmentModal = () => {
    openModal({
      title: '과제 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={assignmentName || '과제'}
          onConfirm={() => {
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      {/* 제목, 체크박스 */}
      <div className={headerStyle}>
        <h1 className={css({ textStyle: 'h3', color: 'gray.900' })}>
          과제 수정
        </h1>
        {/* create->component에 있는걸로 사용 */}
        <CheckboxHeader />
      </div>

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* 과제명, 폴더색, 마감일 */}
      {/* 과제 수정에서는 기본 입력값을 불러오기 위해 이름, 색상, 마감일 전달 */}
      <ModifyAssignmentContent
        name={assignmentName}
        color={folderColor}
        date={dueDate}
        onNameChange={setAssignmentName}
        onColorChange={setFolderColor}
        onDateChange={setDueDate}
      />

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* TASK, 자료 */}
      <div className={taskDataWrapperStyle}>
        {/* TASK 추가 */}
        <ModifyAssignmentTask
          taskId={data?.taskId ?? taskId}
          initialTasks={initialTasks}
        />
        {/* 자료 추가 */}
        <ModifyAssignmentData
          taskId={data?.taskId ?? taskId}
          initialItems={initialDataItems}
        />
      </div>

      {/* 과제 삭제 버튼 추가 및 모달 연결 */}
      <button
        type='button'
        className={deleteAssignmentButtonStyle}
        onClick={handleOpenDeleteAssignmentModal}
      >
        과제 삭제
      </button>

      {/* 취소, 저장 */}
      <div className={buttonWrapperStyle}>
        <Button
          variant='fillGray'
          size={isSidebarCollapsed ? 'xlarge' : 'medium'}
          className={buttonSizeTransitionStyle}
        >
          취소
        </Button>
        <Button
          variant='fillBlue'
          size={isSidebarCollapsed ? 'xlarge' : 'medium'}
          className={buttonSizeTransitionStyle}
          disabled={!isFormValid}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
// 컨테이너에서 사이드바 여부에 따라 너비 조절
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    mt: '2.5rem',
    minHeight: 'calc(100vh - 5.25rem - 2.5rem)',
    pb: '14.5rem',
    transition: 'max-width 0.3s ease',
  },
  variants: {
    collapsed: {
      // 닫힘
      true: { w: '49.625rem' },
      // 열림
      false: { w: '36.875rem' },
    },
  },
});

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: 'full',
  gap: '1.25rem',
});

const taskDataWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const deleteAssignmentButtonStyle = css({
  textStyle: 'body2.m',
  color: 'primary',
  textDecoration: 'underline',
  textUnderlineOffset: '0.3rem', // 임의로 지정
  width: 'fit-content',
  mt: '3.75rem',
  _hover: { cursor: 'pointer' },
});

const buttonWrapperStyle = css({
  display: 'flex',
  gap: '1.25rem',
  mt: '3.75rem',
});

const buttonSizeTransitionStyle = css({
  transition: 'width 0.3s ease, padding 0.3s ease',
});
