import { cva } from '../../../styled-system/css';

const pathStyle = cva({
  base: {
    strokeWidth: '1.66667',
    strokeLinecap: 'round',
  },
  variants: {
    variant: {
      gray: {
        stroke: 'gray.600',
      },
      gray400: {
        stroke: 'gray.400',
      },
      black: {
        stroke: 'gray.900',
      },
      white: {
        stroke: 'white',
      },
      blue: {
        stroke: 'blue.500',
      },
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
});

interface CheckMarkProps {
  variant?: 'gray' | 'gray400' | 'black' | 'white' | 'blue';
  size?: number | string;
  className?: string;
}

export const CheckMark = ({
  variant = 'gray',
  size = 15,
  className,
}: CheckMarkProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 15 15'
      fill='none'
      overflow='visible'
    >
      <path
        d='M0.833008 7.50065L4.58408 13.1273C4.91393 13.622 5.64098 13.622 5.97083 13.1273L14.1663 0.833984'
        className={pathStyle({ variant })}
      />
    </svg>
  );
};
