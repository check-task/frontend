'use client';

import { CompletionProgressBar } from '@/features/assignment/components/CompletionProgressBar';
import { PencilIcon } from '@/components/icons/PencilIcon';
import {
  AssignmentEditModalContent,
  hexToFolderColor,
} from '@/components/AssignmentEditModal';
import { useModalStore } from '@/stores/modal-store';
import { resolveFolderColor } from '@/lib/folder-color';
import type { TaskType } from '@/types/task';
import { css, cva } from 'styled-system/css';

interface AssignmentHeaderProps {
  taskId: number;
  completionRate: number;
  folderColorHex?: string;
  title: string;
  daysLeft: string;
  /** 마감일 - 수정 모달에서 사용 */
  deadline?: string;
  /** 과제 타입 - 수정 모달에서 사용 (기본값: 팀 과제) */
  taskType?: TaskType;
}

export const AssignmentHeader = ({
  taskId,
  completionRate,
  folderColorHex,
  title,
  daysLeft,
  deadline,
  taskType = 'TEAM',
}: AssignmentHeaderProps) => {
  const { openModal } = useModalStore();
  const folderColorToken = hexToFolderColor(folderColorHex) ?? null;
  const folderColor = folderColorHex
    ? (resolveFolderColor(folderColorHex) ?? 'null')
    : 'null';

  const handleEditClick = () => {
    openModal({
      title: '과제 수정',
      content: (
        <AssignmentEditModalContent
          taskId={taskId}
          initialTitle={title}
          initialColor={folderColorToken}
          initialDueDate={deadline}
          taskType={taskType}
        />
      ),
      headerType: 'withClose',
    });
  };

  return (
    <div className={containerStyle}>
      <div className={titleStyle}>
        <div className={titleContentStyle}>
          <div className={colorDotStyle({ color: folderColor })} />
          <p className={titleTextStyle}>{title}</p>
          <button onClick={handleEditClick} style={{ cursor: 'pointer' }}>
            <PencilIcon />
          </button>
        </div>

        <p className={daysLeftStyle({ color: folderColor })}>{daysLeft}</p>
      </div>

      <div className={completionRateStyle}>
        <div className={completionRateContentStyle}>
          <p>완료율</p>
          <p>{completionRate}%</p>
        </div>
        <CompletionProgressBar progress={completionRate} />
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
  transition: 'all 0.3s ease-in-out',
  w: '100%',
});

// 폴더 색상 + 제목 + 디데이
const titleStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
});

// 폴더 색상 + 제목
const titleContentStyle = css({
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
});

// 제목 텍스트
const titleTextStyle = css({
  textStyle: 'h2',
  color: 'gray.900',
  wordBreak: 'break-word',
  minWidth: 0,
});

// 폴더 색상 원
const colorDotStyle = cva({
  base: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    flexShrink: 0,
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
      null: { bg: 'sub.null.100' },
    },
  },
  defaultVariants: { color: 'null' },
});

// 디데이 텍스트
const daysLeftStyle = cva({
  base: {
    textStyle: 'h4',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  variants: {
    color: {
      red: { color: 'sub.01.100' },
      yellow: { color: 'sub.02.100' },
      green: { color: 'sub.03.100' },
      purple: { color: 'sub.04.100' },
      black: { color: 'sub.05.100' },
      null: { color: 'sub.null.100' },
    },
  },
  defaultVariants: { color: 'null' },
});

const completionRateStyle = css({
  ml: '3.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const completionRateContentStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textStyle: 'body1.m',
  color: 'gray.700',
});
