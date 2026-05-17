import { css, cx } from 'styled-system/css';

interface ProfileChangeIconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const ProfileChangeIcon = ({
  size = 18,
  color = 'gray.400',
  strokeWidth = 0.75,
  className,
}: ProfileChangeIconProps) => {
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 18 18'
      fill='none'
      className={iconClassName}
    >
      <path
        d='M3 7.5H15'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
      <path
        d='M15 10.5H3'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
      <path
        d='M6 4.5L3 7.5'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
      <path
        d='M12 13.5L15 10.5'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    </svg>
  );
};
