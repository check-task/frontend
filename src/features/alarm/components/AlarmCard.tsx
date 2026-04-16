'use client';

import { css, cva } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { AlarmIcon } from '@/components/icons/AlarmIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { MyInfoIcon } from '@/components/icons/MyInfoIcon';
import { NoticeIcon } from '@/components/icons/NoticeIcon';
import type { AlarmListItem } from '@/types/alarm';

type AlarmCardProps = AlarmListItem & {
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
};

export const AlarmCard = ({
  alarmType,
  title,
  alarmContent,
  isRead,
  onDelete,
  onClick,
}: AlarmCardProps) => {
  const renderAlarmIcon = () => {
    if (alarmType === 'MEMBER') {
      return <MyInfoIcon color='primary' />;
    }

    if (alarmType === 'NOTIFICATION') {
      return <NoticeIcon color='primary' />;
    }

    return <AlarmIcon />;
  };

  return (
    // 부모 컨테이너에서만 status를 판단하여 전체 투명도를 조절합니다.
    <div
      className={cardContainer({
        status: isRead ? 'done' : 'active',
      })}
      onClick={onClick}
    >
      <div className={iconWrapper()}>{renderAlarmIcon()}</div>

      <div className={textContent}>
        <h4 className={titleStyle}>{title}</h4>
        <p className={contentStyle}>{alarmContent}</p>
      </div>

      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDelete?.(event);
        }}
        className={iconWrapper({ type: 'button' })}
        aria-label='알림 삭제'
      >
        <CloseIcon size='2rem' color='gray.600' strokeWidth={1.33333} />
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
    _hover: {
      cursor: 'pointer',
    },
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
    width: '2rem',
    height: '2rem',
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

const titleStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const contentStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});
