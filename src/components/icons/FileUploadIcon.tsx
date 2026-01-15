import { cva } from '../../../styled-system/css';

const pathStyle = cva({
  base: {
    strokeWidth: '0.833333',
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

interface FileUploadIconProps {
  variant?: 'gray' | 'black';
}

export const FileUploadIcon = ({ variant = 'gray' }: FileUploadIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <path
        d='M2.5 6.66602V4.99935C2.5 4.53911 2.8731 4.16602 3.33333 4.16602H8.72068C8.99931 4.16602 9.2595 4.30527 9.41406 4.5371L10.5859 6.29493C10.7405 6.52676 11.0007 6.66602 11.2793 6.66602H16.6667C17.1269 6.66602 17.5 7.03911 17.5 7.49935V14.9993C17.5 15.4596 17.1269 15.8327 16.6667 15.8327H3.33333C2.8731 15.8327 2.5 15.4596 2.5 14.9993V6.66602Z'
        className={pathStyle({ variant })}
      />
    </svg>
  );
};
