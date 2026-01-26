'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { css } from 'styled-system/css';
import { AssignmentData } from '../personal/components/PersonalEtc';

interface AssignmentDataCardProps extends AssignmentData {
  onEdit: () => void;
  onDelete: () => void;
}

// 자료 모음집 카드 컴포넌트
export const AssignmentDataCard = ({
  name,
  path,
  onEdit,
  onDelete,
}: AssignmentDataCardProps) => {
  return (
    <div className={`group ${cardStyle}`}>
      <div className={headerStyle}>
        <p className={cardTitleStyle}>{name}</p>

        <div className={iconGroupStyle}>
          <button onClick={onEdit}>
            <PencilIcon />
          </button>
          <button onClick={onDelete}>
            <CloseIcon color='gray.700' />
          </button>
        </div>
      </div>
      <p className={cardContentStyle}>{path}</p>
    </div>
  );
};

// ======== 스타일 정의 ========
const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  p: '1.25rem 1rem', //상하 좌우
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%', // 제목+버튼 w 길이에 맞출거임
  shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
});

// 파일명 + 아이콘
const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// 아이콘 묶음
const iconGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexShrink: 0,
  opacity: 0,
  transition: 'opacity 0.2s ease',

  // 카드 호버시 아이콘 나타나도록
  _groupHover: {
    opacity: 1,
  },

  '& svg': {
    cursor: 'pointer',
  },
});

// 파일명
const cardTitleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
  fontWeight: 'bold',
});

// 파일 URL
const cardContentStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
  textDecoration: 'underline',
  wordBreak: 'break-all', // 줄바꿈
});
