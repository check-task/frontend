'use client';

import { useState } from 'react';
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
import { sampleAssignments } from '@/constants/sampleAssignments'; // 임시 데이터

// 더미 데이터에서 red 값으로 받아서 이를 토큰값으로 변환
// 토큰값으로 변환한건 FolderColor 타입에 맞추기 위해서
const folderColorTokenMap = {
  red: 'sub.01.100',
  yellow: 'sub.02.100',
  green: 'sub.03.100',
  purple: 'sub.04.100',
  black: 'sub.05.100',
} as const;

// 과제 수정 전체 컴포넌트
export const ModifyAssignmentForm = () => {
  // 사이드바 상태 가져오기
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();

  // 더미데이터에서 임시로 첫번째 데이터 불러오기
  const defaultAssignment = sampleAssignments[0];

  // 과제 수정 페이지이므로 기본값 세팅
  const [assignmentName, setAssignmentName] = useState(
    defaultAssignment?.assignmentName ?? '',
  );
  const [folderColor, setFolderColor] = useState(
    defaultAssignment?.folderColor
      ? folderColorTokenMap[defaultAssignment.folderColor] //
      : '',
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    defaultAssignment?.dueDate
      ? new Date(`${defaultAssignment.dueDate}T00:00:00`)
      : null,
  );

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
        <ModifyAssignmentTask />
        {/* 자료 추가 */}
        <ModifyAssignmentData />
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
        <Button variant='fillGray' size='xlarge'>
          취소
        </Button>
        <Button variant='fillBlue' size='xlarge' disabled={!isFormValid}>
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
  justifyContent: 'space-between',
  mt: '3.75rem',
  w: '100%',
  maxW: '49.625rem',
});
