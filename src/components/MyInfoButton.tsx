import { cva } from 'styled-system/css';
import { MyInfoIcon } from './icons/MyInfoIcon';

interface MyInfoButtonProps {
  collapsed?: boolean;
}

const buttonStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    textStyle: 'body1.m',
    color: 'blue.600',
    gap: '0.75rem',
    cursor: 'pointer',
    ml: '0.4rem',
  },
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

export const MyInfoButton = ({ collapsed = false }: MyInfoButtonProps) => (
  <button className={buttonStyle()}>
    <div className={iconWrapperStyle()}>
      <MyInfoIcon />
    </div>
    <span className={textStyle({ collapsed })}>내 정보</span>
  </button>
);
