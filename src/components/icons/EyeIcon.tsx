import { css, cx } from 'styled-system/css';

interface EyeIconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const EyeIcon = ({
  size = '1.5rem',
  color = 'gray.600',
  className,
}: EyeIconProps) => {
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      className={iconClassName}
    >
      <circle cx='12' cy='12' r='3' stroke='currentColor' />
      <path
        d='M21 12.1737C21 15.3953 15.7279 17 12 17C8.27202 17 3 15.3953 3 12.1737C3 8.95201 8.27202 7 12 7C15.7279 7 21 8.95201 21 12.1737Z'
        stroke='currentColor'
      />
    </svg>
  );
};
