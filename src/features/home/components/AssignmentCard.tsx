'use client';

import { cva, css } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { FolderColor } from '@/types/folder';
import { useUIStore } from '@/stores/ui-store';

export type ColorBrightness = 'high' | 'medium' | 'low';

interface AssignmentCardProps {
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  assignmentName: string;
  assignmentType: string;
  progress: number;
  index?: number;
}

// index에 따라 명도 결정
const getBrightness = (index: number): ColorBrightness => {
  if (index < 3) return 'high'; // 1~3번째: 100
  if (index < 6) return 'medium'; // 4~6번째: 60
  return 'low'; // 7번째 이후: 40
};

export const AssignmentCard = ({
  folderName,
  folderColor,
  dDay,
  assignmentName,
  assignmentType,
  progress,
  index = 0,
}: AssignmentCardProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const brightness = getBrightness(index);

  return (
    <div className={cardWrapperStyle({ color: folderColor, brightness })}>
      <div className={accentBarStyle} />
      <div className={cardContentStyle({ collapsed: isSidebarCollapsed })}>
        <div className={cardLeftStyle({ collapsed: isSidebarCollapsed })}>
          <span className={folderNameStyle}>{folderName}</span>
          <div className={dDayStyle}>{dDay}</div>
        </div>
        <div className={cardRightStyle({ collapsed: isSidebarCollapsed })}>
          <div className={assignmentInfoStyle}>
            <div className={assignmentHeaderStyle}>
              <div className={assignmentDotStyle} />
              <span className={assignmentNameStyle}>{assignmentName}</span>
            </div>
            <span className={assignmentTypeStyle}>{assignmentType}</span>
          </div>
          <div className={progressSectionStyle}>
            <span className={progressTextStyle}>{progress}%</span>
            <div className={progressBarStyle}>
              <div
                className={progressFillStyle}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardWrapperStyle = cva({
  base: hstack.raw({
    gap: 0,
    bg: 'gray.0',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
    cursor: 'pointer',
    transition: 'width 0.3s ease',
  }),
  variants: {
    color: {
      red: {
        '--card-color-100': 'token(colors.sub.01.100)',
        '--card-color-60': 'token(colors.sub.01.60)',
        '--card-color-40': 'token(colors.sub.01.40)',
      },
      yellow: {
        '--card-color-100': 'token(colors.sub.02.100)',
        '--card-color-60': 'token(colors.sub.02.60)',
        '--card-color-40': 'token(colors.sub.02.40)',
      },
      green: {
        '--card-color-100': 'token(colors.sub.03.100)',
        '--card-color-60': 'token(colors.sub.03.60)',
        '--card-color-40': 'token(colors.sub.03.40)',
      },
      purple: {
        '--card-color-100': 'token(colors.sub.04.100)',
        '--card-color-60': 'token(colors.sub.04.60)',
        '--card-color-40': 'token(colors.sub.04.40)',
      },
      black: {
        '--card-color-100': 'token(colors.sub.05.100)',
        '--card-color-60': 'token(colors.sub.05.60)',
        '--card-color-40': 'token(colors.sub.05.40)',
      },
    },
    brightness: {
      high: { '--card-color': 'var(--card-color-100)' },
      medium: { '--card-color': 'var(--card-color-60)' },
      low: { '--card-color': 'var(--card-color-40)' },
    },
  },
  defaultVariants: {
    brightness: 'high',
  },
});

const accentBarStyle = css({
  width: '0.25rem',
  height: '7.125rem',
  marginLeft: '-0.125rem',
  bg: 'var(--card-color)',
});

const cardContentStyle = cva({
  base: hstack.raw({
    paddingY: '1.5rem',
    flex: 1,
    alignItems: 'flex-start',
    transition: 'gap 0.3s ease',
    gap: '1.25rem',
  }),
  variants: {
    collapsed: {
      true: { paddingX: '1.5rem' },
      false: { paddingX: '1.25rem' },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const cardLeftStyle = cva({
  base: stack.raw({
    gap: '3rem',
    transition: 'width 0.3s ease',
  }),
  variants: {
    collapsed: {
      true: { width: '7.125rem' },
      false: { width: '4.375rem' },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const cardRightStyle = cva({
  base: stack.raw({
    gap: '0.75rem',
    transition: 'width 0.3s ease',
  }),
  variants: {
    collapsed: {
      true: { width: '15.75rem' },
      false: { width: '14.375rem' },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const folderNameStyle = css({
  textStyle: 'body3.m',
  color: 'var(--card-color)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const dDayStyle = css({
  paddingY: '0.25rem',
  borderRadius: '0.25rem',
  textStyle: 'btn',
  color: 'primary-button-text',
  bg: 'var(--card-color)',
  width: '4.3125rem',
  textAlign: 'center',
});

const assignmentInfoStyle = css(
  stack.raw({
    gap: '0.25rem',
  }),
);

const assignmentHeaderStyle = css(
  hstack.raw({
    gap: '0.75rem',
    alignItems: 'center',
  }),
);

const assignmentDotStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  bg: 'var(--card-color)',
  flexShrink: 0,
});

const assignmentNameStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const assignmentTypeStyle = css({
  textStyle: 'body4.r',
  color: 'gray.400',
  paddingLeft: '2.25rem',
});

const progressSectionStyle = css(
  stack.raw({
    gap: '0.375rem',
    width: '100%',
    paddingLeft: '2.25rem',
  }),
);

const progressTextStyle = css({
  textStyle: 'body4.r',
  color: 'gray.900',
});

const progressBarStyle = css({
  width: '100%',
  height: '0.375rem',
  bg: 'gray.100',
  borderRadius: '0.625rem',
  overflow: 'hidden',
});

const progressFillStyle = css({
  height: '100%',
  borderRadius: '0.625rem',
  bg: 'var(--card-color)',
});
