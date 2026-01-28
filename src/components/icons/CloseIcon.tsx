import { css } from 'styled-system/css';

interface CloseIconProps {
  size?: number | string; // 크기
  color?: string; // 색상
  strokeWidth?: number; // 선 두께
}

export const CloseIcon = ({
  size = '1.75rem',
  color = 'gray.900',
  strokeWidth = 1.16667,
}: CloseIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 28 28'
      fill='none'
      style={{ color }}
    >
      <path
        d='M21 7L7 21'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
      <path
        d='M7 7L21 21'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    </svg>
  );
};
