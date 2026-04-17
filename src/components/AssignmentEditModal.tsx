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
import { usePatchTask } from '@/hooks/mutations/usePatchTask';
import { useModalStore } from '@/stores/modal-store';

interface AssignmentEditModalContentProps {
  taskId: number;
  initialTitle: string;
  initialColor: FolderColor | null;
  initialDueDate?: string;
  onSuccess?: () => void;
}

const FOLDER_COLORS: FolderColor[] = ['01', '02', '03', '04', '05'];

const DEFAULT_DEADLINE_TIME = 'T23:59:59';

/** FolderColor 이름 → Assignment 토큰 매핑 */
const NAME_TO_TOKEN: Partial<Record<FolderColorName, FolderColor>> = {
  red: '01',
  yellow: '02',
  green: '03',
  purple: '04',
  black: '05',
};

/** Assignment 토큰 → FolderColor 이름 역매핑 */
const TOKEN_TO_NAME: Record<FolderColor, FolderColorName> = {
  '01': 'red',
  '02': 'yellow',
  '03': 'green',
  '04': 'purple',
  '05': 'black',
};

export function hexToFolderColor(hex?: string): FolderColor | undefined {
  if (!hex) return undefined;
  const name = resolveFolderColor(hex);
  return name ? NAME_TO_TOKEN[name] : undefined;
}

const hasTimeSet = (deadline?: string): boolean => {
  if (!deadline) return false;
  return deadline.includes('T') && !deadline.endsWith(':59');
};

const formatDeadline = (date: Date, withTime: boolean): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (withTime) {
    return `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }
  return `${base}${DEFAULT_DEADLINE_TIME}`;
};

export const AssignmentEditModalContent = ({
  taskId,
  initialTitle,
  initialColor,
  initialDueDate,
  onSuccess,
}: AssignmentEditModalContentProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedColor, setSelectedColor] = useState<FolderColor | null>(
    initialColor ?? null,
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialDueDate ? new Date(initialDueDate) : undefined,
  );
  const [timeEnabled, setTimeEnabled] = useState(() =>
    hasTimeSet(initialDueDate),
  );
  const { data: myInfo } = useMyInfo();
  const { mutate: patchTask, isPending } = usePatchTask(taskId);
  const { closeModal } = useModalStore();

  // 사용자가 실제 생성한 폴더의 색상(중복 제거)
  const userColors: FolderColor[] = myInfo
    ? [
        ...new Set(
          myInfo.folders
            .map((f) => NAME_TO_TOKEN[f.color])
            .filter((c): c is FolderColor => c !== undefined),
        ),
      ]
    : FOLDER_COLORS;

  // 선택된 색상에 해당하는 folderId 조회
  const resolveFolderId = (): number | null => {
    if (!selectedColor || !myInfo) return null;
    const colorName = TOKEN_TO_NAME[selectedColor];
    const folder = myInfo.folders.find((f) => f.color === colorName);
    return folder?.id ?? null;
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const folderId = resolveFolderId();

    const deadline = dueDate
      ? formatDeadline(dueDate, timeEnabled)
      : (initialDueDate ?? '');

    patchTask(
      { title: trimmedTitle, folderId, deadline },
      {
        onSuccess: () => {
          closeModal();
          onSuccess?.();
        },
      },
    );
  };

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
              onClick={() =>
                setSelectedColor(selectedColor === color ? null : color)
              }
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
          onChange={(date, withTime) => {
            setDueDate(date);
            setTimeEnabled(withTime);
          }}
          initialTimeEnabled={timeEnabled}
          showTimeDisplay={true}
        />
      </div>

      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={isPending}
      >
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
