import { css, cx } from 'styled-system/css';

interface CloseIconProps {
  size?: number | string; // 크기
  color?: string; // 색상- 토큰으로 전달 가능
  strokeWidth?: number; // 선 두께
  className?: string;
}

export const CloseIcon = ({
  size = '1.75rem',
  color = 'gray.900',
  strokeWidth = 1.16667,
  className,
}: CloseIconProps) => {
  // 토큰을 바로 쓸 수 없어서 css 함수 사용
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 28 28'
      fill='none'
      className={iconClassName}
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
