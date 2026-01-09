import { cva } from 'styled-system/css';
import { CompletedAssignmentIcon } from './icons/CompletedAssignmentIcon';

// collapsed: 버튼 축소 여부
interface CompletedAssignmentButtonProps {
  collapsed?: boolean;
}

export const CompletedAssignmentButton = ({
  collapsed = false,
}: CompletedAssignmentButtonProps) => {
  const completedAssignmentButtonStyle = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      textStyle: 'body1.m',
      color: 'blue.600',
      gap: '0.75rem',
      cursor: 'pointer',
    },
  });

  const spanStyle = cva({
    variants: {
      collapsed: {
        true: {
          opacity: 0,
          w: 0,
          display: 'none',
        },
        false: {
          opacity: 1,
          display: 'block',
        },
      },
    },
  });

  return (
    <button className={completedAssignmentButtonStyle({ collapsed })}>
      <CompletedAssignmentIcon />
      <span className={spanStyle({ collapsed })}>완료 과제 히스토리</span>
    </button>
  );
};
