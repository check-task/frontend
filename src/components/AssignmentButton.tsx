import { cva } from 'styled-system/css';
import { AssignmentIcon } from './icons/AssignmentIcon';

// collapsed: 버튼 축소 여부
interface AssignmentButtonProps {
  collapsed?: boolean;
}

export const AssignmentButton = ({
  // 기본값: 축소
  collapsed = false,
}: AssignmentButtonProps) => {
  const assignmentButtonStyle = cva({
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
    <button className={assignmentButtonStyle({ collapsed })}>
      <AssignmentIcon />
      <span className={spanStyle({ collapsed })}>과제</span>
    </button>
  );
};
