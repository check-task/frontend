'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { CheckboxHeader } from './CheckboxHeader';
import { AddAssignmentContent } from './AddAssignmentContent';
import { AddAssignmentTask } from './AddAssignmentTask';
import { AddAssignmentData } from './AddAssignmentData';
import { css } from 'styled-system/css';

export const CreateAssignmentForm = () => {
  const [assignmentName, setAssignmentName] = useState('');
  const [folderColor, setFolderColor] = useState('');

  const isFormValid = assignmentName.trim() !== '' && folderColor !== '';

  return (
    <div className={containerStyle}>
      {/* 제목, 체크박스 */}
      <div className={headerStyle}>
        <h1 className={css({ textStyle: 'h3', color: 'gray.900' })}>
          과제 등록
        </h1>
        <CheckboxHeader />
      </div>

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* 과제명, 폴더색, 마감일 */}
      <AddAssignmentContent
        onNameChange={setAssignmentName}
        onColorChange={setFolderColor}
      />

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* TASK, 자료 */}
      <div className={taskDataWrapperStyle}>
        <AddAssignmentTask />
        <AddAssignmentData />
      </div>

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

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '100%',
  maxW: '49.625rem',
  mt: '2.5rem',
  minHeight: 'calc(100vh - 5.25rem - 2.5rem)',
  pb: '14.5rem',
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

const buttonWrapperStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  mt: '6.125rem',
  w: '100%',
  maxW: '49.625rem',
});
