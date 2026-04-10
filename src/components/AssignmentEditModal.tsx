'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { Input } from '@/components/TextField';
import { Button } from '@/components/Button';
import { CheckMark } from '@/components/icons/CheckMark';
import DatePicker from '@/components/DatePicker';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { resolveFolderColor } from '@/lib/folder-color';
import type { FolderColor as FolderColorName } from '@/types/folder';
import {
  colorMap,
  type FolderColor,
} from '@/features/assignment/components/FolderClassification';

interface AssignmentEditModalContentProps {
  initialTitle: string;
  initialColor: FolderColor | null;
  initialDueDate?: string;
}

const FOLDER_COLORS: FolderColor[] = ['01', '02', '03', '04', '05'];

/** FolderColor 이름 Assignment 토큰 매핑 */
const NAME_TO_TOKEN: Partial<Record<FolderColorName, FolderColor>> = {
  red: '01',
  yellow: '02',
  green: '03',
  purple: '04',
  black: '05',
};

export function hexToFolderColor(hex?: string): FolderColor | undefined {
  if (!hex) return undefined;
  const name = resolveFolderColor(hex);
  return name ? NAME_TO_TOKEN[name] : undefined;
}

export const AssignmentEditModalContent = ({
  initialTitle,
  initialColor,
  initialDueDate,
}: AssignmentEditModalContentProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedColor, setSelectedColor] = useState<FolderColor | null>(initialColor ?? null);
  const [dueDate, setDueDate] = useState<string | undefined>(initialDueDate);
  const { data: myInfo } = useMyInfo();

  // 사용자가 실제 생성한 폴더의 색상(중복 제거)
  const userColors: FolderColor[] = myInfo
    ? [...new Set(myInfo.folders.map((f) => NAME_TO_TOKEN[f.color]).filter((c): c is FolderColor => c !== undefined))]
    : FOLDER_COLORS;

  return (
    <div className={contentStyle}>
      {/* 과제명 */}
      <div className={fieldStyle}>
        <label className={labelStyle}>과제명</label>
        <Input
          size='modal'
          width='full'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 폴더색 */}
      <div className={fieldStyle}>
        <p className={labelStyle}>폴더색</p>
        <div className={colorRowStyle}>
          {userColors.map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => setSelectedColor(selectedColor === color ? null : color)}
              className={css({
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                bg: colorMap[color],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                flexShrink: 0,
              })}
            >
              {selectedColor === color && <CheckMark variant='white' />}
            </button>
          ))}
        </div>
      </div>

      {/* 마감일 */}
      <div className={fieldStyle}>
        <p className={labelStyle}>마감일</p>
        <DatePicker
          value={dueDate}
          onChange={(date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            setDueDate(`${yyyy}-${mm}-${dd}`);
          }}
        />
      </div>

      <Button variant='fillBlue' size='xlarge'>
        변경사항 저장
      </Button>
    </div>
  );
};

// ======== 스타일 정의 ========
const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem', 
  pt: '1.75rem',
});

const fieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem', 
});

const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});

const colorRowStyle = css({
  display: 'flex',
  gap: '0.75rem', // 12px
  alignItems: 'center',
});


