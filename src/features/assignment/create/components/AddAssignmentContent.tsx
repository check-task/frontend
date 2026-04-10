'use client';

import { Input } from '@/components/TextField';
import { FolderSelect } from './FolderSelect';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';
import type { Folder } from '@/types/folder';

interface AddAssignmentContentProps {
  onNameChange?: (name: string) => void;
  folders: Folder[];
  selectedFolderId: number | null;
  onFolderChange?: (folderId: number) => void;
  onDateChange?: (date: Date, timeEnabled: boolean) => void;
}

export const AddAssignmentContent = ({
  onNameChange,
  folders,
  selectedFolderId,
  onFolderChange,
  onDateChange,
}: AddAssignmentContentProps) => {
  return (
    <div className={contentWrapperStyle}>
      <div className={contentItemStyle}>
        <p className={labelTextStyle}>과제명</p>
        <Input
          size='basic'
          placeholder='과제명을 입력하세요.'
          className={css({ flex: 1 })}
          onChange={(e) => onNameChange?.(e.target.value)}
        />
      </div>

      <div className={contentItemStyle}>
        <p className={labelTextStyle}>폴더색</p>
        <FolderSelect
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderChange={(id) => onFolderChange?.(id)}
        />
      </div>

      <div className={contentItemStyle}>
        <p className={labelTextStyle}>마감일</p>
        <DatePicker
          onChange={(d, t) => onDateChange?.(d, t)}
          showTimeDisplay={true}
        />
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
