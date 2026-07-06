import { token } from 'styled-system/tokens';

interface FilterIconProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

export const FilterIcon = ({
  size = 24,
  color = token('colors.gray.800'),
  bgColor = token('colors.gray.0'),
}: FilterIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ flexShrink: 0 }}
  >
    <rect width='24' height='24' rx='12' fill={bgColor} />
    <path d='M16 12L8 12' stroke={color} strokeLinecap='round' />
    <path d='M18 9L6 9' stroke={color} strokeLinecap='round' />
    <path d='M14 15L10 15' stroke={color} strokeLinecap='round' />
  </svg>
);
