'use client';

import { Input } from '@/components/TextField';
import { FolderSelect } from '../../create/components/FolderSelect';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';
import type { Folder } from '@/types/folder';

interface ModifyAssignmentContentProps {
  name?: string;
  folders: Folder[];
  selectedFolderId: number | null;
  date?: string | Date | null;
  onNameChange?: (name: string) => void;
  onFolderChange?: (folderId: number) => void;
  onDateChange?: (date: Date | null) => void;
}

// create의 AddAssignmentContent와 거의 동일한 컴포넌트
// 수정 페이지에서는 기본값을 전달 받도록
export const ModifyAssignmentContent = ({
  name,
  folders,
  selectedFolderId,
  date,
  onNameChange,
  onFolderChange,
  onDateChange,
}: ModifyAssignmentContentProps) => {
  return (
    <div className={contentWrapperStyle}>
      <div className={contentItemStyle}>
        <p className={labelTextStyle}>과제명</p>
        <Input
          size='basic'
          placeholder='과제명을 입력하세요.'
          className={css({ flex: 1 })}
          // 과제명 기본값 전달
          value={name ?? ''}
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
        {/* 마감일 기본값 전달 */}
        <DatePicker
          value={date ?? undefined}
          onChange={(nextDate) => onDateChange?.(nextDate)}
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
