import Link from 'next/link';
import { cva } from 'styled-system/css';
import { NoticeIcon } from './icons/NoticeIcon';

interface NoticeButtonProps {
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

export const NoticeButton = ({ collapsed = false }: NoticeButtonProps) => (
  <Link href='/notice' className={buttonStyle()}>
    <div className={iconWrapperStyle()}>
      <NoticeIcon />
    </div>
    <span className={textStyle({ collapsed })}>공지사항</span>
  </Link>
);
