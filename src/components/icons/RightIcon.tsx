import { cva } from 'styled-system/css';

const iconStyle = cva({
  base: {
    strokeLinecap: 'round',
  },
  variants: {
    size: {
      md: { width: '1.5rem', height: '1.5rem' }, // 기존 datePicker용
      lg: { width: '2.25rem', height: '2.25rem', strokeWidth: '1.5' }, // 추가 MonthPicker용
      xl: { width: '2.5rem', height: '2.5rem' },
    },
    stroke: {
      default: { stroke: 'gray.900' },
      login: { stroke: 'gray.400' },
      tablet: { stroke: 'gray.200' },
    },
  },
  defaultVariants: {
    size: 'md',
    stroke: 'default',
  },
});

interface IconProps {
  size?: 'md' | 'lg' | 'xl';
  stroke?: 'default' | 'login' | 'tablet';
}

export const RightIcon = ({ size = 'md', stroke }: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      className={iconStyle({ size, stroke })}
    >
      <path d='M10 6L15.2929 11.2929C15.6834 11.6834 15.6834 12.3166 15.2929 12.7071L10 18' />
    </svg>
  );
};
