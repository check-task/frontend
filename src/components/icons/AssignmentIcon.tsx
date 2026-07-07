import { token } from 'styled-system/tokens';

interface AssignmentIconProps {
  size?: number;
  color?: string;
}

export const AssignmentIcon = ({
  size = 36,
  color = token('colors.blue.600'),
}: AssignmentIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 36 36'
    fill='none'
  >
    <path
      d='M28.5 12.75V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5H21.9375M28.5 12.75L21.9375 4.5M28.5 12.75H23.4375C22.6091 12.75 21.9375 12.0784 21.9375 11.25V4.5M12 21H18M12 16.5H21M12 25.5H22.5'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </svg>
);
