'use client';

import { Input } from '@/components/TextField';
import { FolderColorSelect } from './FolderColorSelect';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';

export const AddAssignmentContent = () => {
  return (
    <div className={contentWrapperStyle}>
      <div className={contentItemStyle}>
        <p className={labelTextStyle}>과제명</p>
        <Input
          size='basic'
          placeholder='과제명을 입력하세요.'
          className={css({ flex: 1 })}
        />
      </div>

      <div className={contentItemStyle}>
        <p className={labelTextStyle}>폴더색</p>
        <FolderColorSelect />
      </div>

      <div className={contentItemStyle}>
        <p className={labelTextStyle}>마감일</p>
        <DatePicker />
      </div>
    </div>
  );
};

const labelTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
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
