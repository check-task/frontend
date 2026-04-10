'use client';

import { CompletionProgressBar } from '@/features/assignment/components/CompletionProgressBar';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { AssignmentEditModalContent, hexToFolderColor } from '@/components/AssignmentEditModal';
import { useModalStore } from '@/stores/modal-store';
import { css } from 'styled-system/css';

interface AssignmentHeaderProps {
  completionRate: number;
  folderColorHex?: string;
  title: string;
  daysLeft: string;
  /** 마감일 - 수정 모달에서 사용 */
  deadline?: string;
}

export const AssignmentHeader = ({
  completionRate,
  folderColorHex,
  title,
  daysLeft,
  deadline,
}: AssignmentHeaderProps) => {
  const { openModal } = useModalStore();
  const folderColorToken = hexToFolderColor(folderColorHex) ?? null;

  const handleEditClick = () => {
    openModal({
      title: '과제 수정',
      content: (
        <AssignmentEditModalContent
          initialTitle={title}
          initialColor={folderColorToken}
          initialDueDate={deadline}
        />
      ),
      headerType: 'withClose',
    });
  };

  return (
    <div className={containerStyle}>
      <div className={titleStyle}>
        <div className={titleContentStyle}>
          <div
            className={css({
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              flexShrink: 0,
            })}
            style={{ backgroundColor: folderColorHex }}
          />
          <p className={titleTextStyle}>{title}</p>
          <button onClick={handleEditClick} style={{ cursor: 'pointer' }}>
            <PencilIcon />
          </button>
        </div>

        <p className={daysLeftStyle} style={{ color: folderColorHex }}>
          {daysLeft}
        </p>
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

const daysLeftStyle = css({
  textStyle: 'h4',
  flexShrink: 0,
  whiteSpace: 'nowrap',
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
