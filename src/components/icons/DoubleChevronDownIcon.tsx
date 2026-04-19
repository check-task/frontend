import type { CSSProperties } from 'react';
import { cva } from 'styled-system/css';

const iconStyle = cva({
  base: {
    strokeLinecap: 'round',
    strokeWidth: '1.5',
    fill: 'none',
  },
  variants: {
    size: {
      md: { width: '1.5rem', height: '1.5rem' },
      lg: { width: '2.25rem', height: '2.25rem' },
    },
    stroke: {
      default: { stroke: 'gray.900' },
      login: { stroke: 'gray.200' },
    },
  },
  defaultVariants: {
    size: 'lg',
    stroke: 'login',
  },
});

interface IconProps {
  size?: 'md' | 'lg';
  stroke?: 'default' | 'login';
  className?: string;
  style?: CSSProperties;
}

export const DoubleChevronDownIcon = ({ size, stroke, className, style }: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={iconStyle({ size, stroke }) + (className ? ` ${className}` : '')}
      viewBox='0 0 36 36'
      style={style}
    >
      <path d='M6 18L17.1 26.325C17.6333 26.725 18.3667 26.725 18.9 26.325L30 18' />
      <path d='M6 9L17.1 17.325C17.6333 17.725 18.3667 17.725 18.9 17.325L30 9' />
    </svg>
  );
};
