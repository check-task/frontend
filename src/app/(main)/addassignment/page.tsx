import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { PlusButton } from '@/components/PlusButton';
import { Input } from '@/components/TextField';
import { FolderColorSelect } from '@/features/addassignment/components/FolderColorSelect';
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
        <div className={checkboxWrapperStyle}>
          <div className={checkboxContainerStyle}>
            <Checkbox />
            <p>팀프로젝트</p>
          </div>
          <div className={checkboxContainerStyle}>
            <Checkbox />
            <p>웬투밋 추가</p>
          </div>
        </div>
      </div>

      <div className={dividerStyle} />

      {/* 과제명, 폴더색, 마감일 */}
      <div className={contentWrapperStyle}>
        <div className={contentItemStyle}>
          <p className={labelTextStyle}>과제명</p>
          <Input size='basic' placeholder='과제명을 입력하세요.' />
        </div>

        <div className={contentItemStyle}>
          <p className={labelTextStyle}>폴더색</p>
          <FolderColorSelect />
        </div>

        <div className={contentItemStyle}>
          <p className={labelTextStyle}>마감일</p>
          {/* DatePicker 추가 */}
        </div>
      </div>

      <div className={dividerStyle} />

      {/* TASK, 자료 */}
      <div className={taskDataWrapperStyle}>
        <div className={taskDataItemStyle}>
          <p className={labelTextStyle}>TASK</p>
          <PlusButton>TASK 추가하기</PlusButton>
        </div>

        <div className={taskDataItemStyle}>
          <p className={labelTextStyle}>자료</p>
          <PlusButton className={css({ ml: '1rem' })}>자료 추가하기</PlusButton>
        </div>
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
});

const labelTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const HeaderStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: 'full',
  gap: '1.25rem',
});

const checkboxWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.75rem',
});

const checkboxContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textStyle: 'body1.m',
  color: 'gray.600',
});

const dividerStyle = css({
  border: '0.0625rem solid',
  borderColor: 'gray.200',
  width: 'full',
  mt: '1.75rem',
  mb: '1.75rem',
});

const contentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

const contentItemStyle = css({
  display: 'flex',
  gap: '1.75rem',
  alignItems: 'center',
});

const taskDataWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const taskDataItemStyle = css({
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
});

const buttonWrapperStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 'auto',
  marginBottom: '5rem',
});

export default page;
