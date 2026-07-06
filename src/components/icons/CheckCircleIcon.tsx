import { token } from 'styled-system/tokens';

interface CheckCircleIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const CheckCircleIcon = ({
  size = 24,
  color = token('colors.gray.800'),
  filled = false,
}: CheckCircleIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ flexShrink: 0 }}
  >
    <circle cx='12' cy='12' r='8.5' fill={filled ? color : 'none'} stroke={color} />
    <path
      d='M8 12L10.2506 15.376C10.4486 15.6728 10.8848 15.6728 11.0827 15.376L16 8'
      stroke={filled ? 'white' : color}
      strokeLinecap='round'
    />
  </svg>
);
