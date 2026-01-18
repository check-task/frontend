import { cva } from 'styled-system/css';

const iconStyle = cva({
  base: {
    stroke: 'gray.900',
    strokeLinecap: 'round',
  },
  variants: {
    size: {
      md: { width: '1.5rem', height: '1.5rem' }, // 기존 datePicker용
      lg: { width: '2.25rem', height: '2.25rem', strokeWidth: '1.5' }, // 추가 MonthPicker용
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface IconSizeProps {
  size?: 'md' | 'lg';
}

export const DatepickerPrevIcon = ({ size = 'md' }: IconSizeProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={iconStyle({ size })}
      viewBox='0 0 24 24'
      fill='none'
    >
      <path d='M14 6L8.70711 11.2929C8.31658 11.6834 8.31658 12.3166 8.70711 12.7071L14 18' />
    </svg>
  );
};
