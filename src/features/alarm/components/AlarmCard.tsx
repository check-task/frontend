'use client';

import { css, cva } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { AlarmIcon } from '@/components/icons/AlarmIcon';
import { AlarmCloseIcon } from '@/components/icons/AlarmCloseIcon';

export interface AlarmCardProps {
  taskTitle: string; // 과제 제목
  remainingTime: number; // 남은 시간 (숫자만 받음)
  progressRate: number; // 진행률 (숫자만 받음)
  isDone?: boolean; // 끝났는지 아닌지
  onDelete?: () => void;
}

export const AlarmCard = ({
  taskTitle,
  remainingTime,
  progressRate,
  isDone = false,
  onDelete,
}: AlarmCardProps) => {
  // 고정멘트 작성
  const deadlineText = `'${taskTitle}'의 마감까지 ${remainingTime}시간 남았어요!`;
  const progressText = `현재 ${progressRate}% 완성 중이에요. 빨리 끝내고 쉬어요!`;

  return (
    // 부모 컨테이너에서만 status를 판단하여 전체 투명도를 조절합니다.
    <div
      className={cardContainer({
        status: isDone ? 'done' : 'active',
      })}
    >
      <div className={iconWrapper()}>
        <AlarmIcon />
      </div>

      <div className={textContent}>
        <h4 className={deadlineStyle}>{deadlineText}</h4>
        <p className={progressStyle}>{progressText}</p>
      </div>

      <button
        onClick={onDelete}
        className={iconWrapper({ type: 'button' })}
        aria-label='알림 삭제'
      >
        <AlarmCloseIcon />
      </button>
    </div>
  );
};

// ======== 스타일 정의 ========
const cardContainer = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    w: '100%',
    padding: '1.25rem 1.5rem',
    borderRadius: '0.75rem',
    backgroundColor: 'blue.50',
    gap: '1rem',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.16)',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  variants: {
    // 알림 완료 상태
    status: {
      active: {
        opacity: 1,
      },
      done: {
        opacity: 0.4,
      },
    },
  },
});

// 종 아이콘, 닫기 아이콘(버튼으로 변형)
const iconWrapper = cva({
  base: {
    width: '2.25rem',
    height: '2.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  variants: {
    type: {
      button: {
        cursor: 'pointer',
        flexShrink: 0,
      },
    },
  },
});

const textContent = flex({
  direction: 'column',
  flex: 1,
  gap: '0.5rem',
});

const deadlineStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const progressStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});
