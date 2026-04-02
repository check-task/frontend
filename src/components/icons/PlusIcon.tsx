import { css, cx } from 'styled-system/css';

interface PlusIconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const PlusIcon = ({ size = '1.25rem', color = 'currentColor', className }: PlusIconProps) => {
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
      className={iconClassName}
    >
      <path
        d='M3.3335 10H16.6668'
        stroke='currentColor'
        strokeWidth='0.833333'
        strokeLinecap='round'
      />
      <path
        d='M10 3.33334V16.6667'
        stroke='currentColor'
        strokeWidth='0.833333'
        strokeLinecap='round'
      />
    </svg>
  );
};
