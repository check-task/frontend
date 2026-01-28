import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { CheckboxHeader } from '@/features/assignment/create/components/CheckboxHeader';
import { AddAssignmentContent } from '@/features/assignment/create/components/AddAssignmentContent';
import { AddAssignmentTask } from '@/features/assignment/create/components/AddAssignmentTask';
import { AddAssignmentData } from '@/features/assignment/create/components/AddAssignmentData';
import React from 'react';
import { css } from 'styled-system/css';

const page = () => {
  return (
    <div className={containerStyle}>
      {/* 제목, 체크박스 */}
      <div className={HeaderStyle}>
        <h1 className={css({ textStyle: 'h3', color: 'gray.900' })}>
          과제 등록
        </h1>
        <CheckboxHeader />
      </div>

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* 과제명, 폴더색, 마감일 */}
      <AddAssignmentContent />

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
        <Button variant='fillBlue' size='xlarge'>
          저장
        </Button>
      </div>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '49.625rem',
  mt: '2.5rem',
  minHeight: 'calc(100vh - 5.25rem - 2.5rem)',
  pb: '14.5rem',
});

const HeaderStyle = css({
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
  w: '49.625rem',
});

export default page;
