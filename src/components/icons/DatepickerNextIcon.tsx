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

export const DatepickerNextIcon = ({ size = 'md' }: IconSizeProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      className={iconStyle({ size })}
    >
      <path d='M10 6L15.2929 11.2929C15.6834 11.6834 15.6834 12.3166 15.2929 12.7071L10 18' />
    </svg>
  );
};
