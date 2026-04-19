import { cva, css } from 'styled-system/css';
import { AssignmentIcon } from './icons/AssignmentIcon';
import { ChevronIcon } from './icons/ChevronIcon';

interface AssignmentButtonProps {
  collapsed?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const buttonStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    textStyle: 'body1.m',
    color: 'blue.600',
    gap: '0.75rem',
    cursor: 'pointer',
    w: '100%',
    justifyContent: 'space-between',
  },
});

const leftPartStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

const iconWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    w: '1.75rem',
    h: '1.75rem',
  },
});

const textStyle = cva({
  base: {
    transition:
      'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
  },
  variants: {
    collapsed: {
      true: {
        opacity: 0,
        w: 0,
        overflow: 'hidden',
      },
      false: {
        opacity: 1,
        w: 'auto',
      },
    },
  },
});

const chevronWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition:
      'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  variants: {
    collapsed: {
      true: { opacity: 0, w: 0, overflow: 'hidden' },
      false: { opacity: 1, w: 'auto' },
    },
  },
});

export const AssignmentButton = ({
  collapsed = false,
  isOpen = false,
  onClick,
}: AssignmentButtonProps) => (
  <button type='button' className={buttonStyle()} onClick={onClick}>
    <div className={leftPartStyle}>
      <div className={iconWrapperStyle()}>
        <AssignmentIcon />
      </div>
      <span className={textStyle({ collapsed })}>과제</span>
    </div>
    <span
      className={chevronWrapperStyle({ collapsed })}
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <ChevronIcon />
    </span>
  </button>
);
