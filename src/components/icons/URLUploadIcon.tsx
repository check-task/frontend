import { cva } from '../../../styled-system/css';

const pathStyle = cva({
  base: {
    strokeWidth: '0.833333',
    strokeLinecap: 'round',
  },
  variants: {
    variant: {
      gray: {
        stroke: 'gray.500',
      },
      black: {
        stroke: 'gray.900',
      },
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
});

interface URLUploadIconProps {
  variant?: 'gray' | 'black';
}

export const URLUploadIcon = ({ variant = 'gray' }: URLUploadIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='-2 -2 20 20'
      fill='none'
    >
      <path
        d='M5.30371 10.0171L10.0178 5.30304'
        className={pathStyle({ variant })}
      />
      <path
        d='M9.42889 10.6058L7.07187 12.9628C5.77012 14.2645 3.65957 14.2645 2.35782 12.9628C1.05607 11.6611 1.05607 9.5505 2.35782 8.24876L4.71484 5.89173'
        className={pathStyle({ variant })}
      />
      <path
        d='M10.6072 9.4284L12.9643 7.07138C14.266 5.76963 14.266 3.65908 12.9643 2.35733C11.6625 1.05558 9.55197 1.05559 8.25022 2.35733L5.8932 4.71436'
        className={pathStyle({ variant })}
      />
    </svg>
  );
};
