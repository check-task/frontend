import { cva } from '../../../styled-system/css';

const pathStyle = cva({
  base: {
    strokeWidth: '0.833333',
    strokeLinecap: 'round',
  },
  variants: {
    variant: {
      gray400: {
        stroke: 'gray.400',
      },
    },
  },
  defaultVariants: {
    variant: 'gray400',
  },
});

interface AddURLDataPlusIconProps {
  variant?: 'gray400';
}

export const AddURLDataPlusIcon = ({
  variant = 'gray400',
}: AddURLDataPlusIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <path d='M3.33301 10H16.6663' className={pathStyle({ variant })} />
      <path d='M10 3.33398V16.6673' className={pathStyle({ variant })} />
    </svg>
  );
};
