import { styled } from 'styled-system/jsx';
import { center, hstack, stack } from 'styled-system/patterns';
import { cva, css, cx } from 'styled-system/css';
import { FolderColor } from '@/types/folder';

interface AssignmentCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  folderName: string;
  assignmentName: string;
  dueDate: string | number;
  folderColor: FolderColor;
  dateType?: 'dday' | 'date';
  children?: React.ReactNode;
}

export const AssignmentCard = ({
  folderName,
  assignmentName,
  dueDate,
  folderColor,
  dateType = 'dday',
  className,
  ...props
}: AssignmentCardProps) => {
  // D-day 표시 형식 처리
  const displayDate =
    dateType === 'dday' && typeof dueDate === 'number'
      ? `D-${dueDate}`
      : dateType === 'date'
        ? String(dueDate).replace(/-/g, '.')
        : String(dueDate);

  return (
    <button className={cx(cardContainerStyle, className)} {...props}>
      <AssignmentCardStyle.InfoSection>
        <AssignmentCardStyle.FolderSection>
          <div className={folderIconStyle({ color: folderColor })} />
          <AssignmentCardStyle.FolderName>
            {folderName}
          </AssignmentCardStyle.FolderName>
        </AssignmentCardStyle.FolderSection>
        <AssignmentCardStyle.AssignmentName>
          {assignmentName}
        </AssignmentCardStyle.AssignmentName>
      </AssignmentCardStyle.InfoSection>
      <span className={dateStyle({ color: folderColor, type: dateType })}>
        {displayDate}
      </span>
    </button>
  );
};

const folderIconStyle = cva({
  base: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
    },
  },
});

const dateStyle = cva({
  base: {
    paddingX: '0.75rem',
    paddingY: '0.25rem',
    borderRadius: '0.25rem',
    textStyle: 'btn',
  },
  variants: {
    color: {
      red: { color: 'sub.01.100' },
      yellow: { color: 'sub.02.100' },
      green: { color: 'sub.03.100' },
      purple: { color: 'sub.04.100' },
      black: { color: 'sub.05.100' },
    },
    type: {
      dday: {},
      date: {
        color: 'gray.400',
        textStyle: 'body3.r',
      },
    },
  },
});

const cardContainerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingX: '1.5rem',
    paddingY: '1.25rem',
    borderRadius: '0.75rem',
    bg: 'gray.0',
    shadow: '0px 0.0625rem 0.25rem 0px rgba(0, 0, 0, 0.16)',
    cursor: 'pointer',
    width: '100%',
    _hover: {
      bg: 'blue.50',
      transition: 'background-color 0.4s ease-out',
    },
  }),
);

const AssignmentCardStyle = {
  InfoSection: styled('div', {
    base: stack.raw({
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      height: '3.75rem',
    }),
  }),
  FolderSection: styled('div', {
    base: hstack.raw({ gap: '0.25rem', alignItems: 'center' }),
  }),
  FolderName: styled('p', {
    base: { textStyle: 'body3.r', color: 'gray.600' },
  }),
  AssignmentName: styled('p', {
    base: { textStyle: 'body1.m', color: 'gray.900' },
  }),
};
