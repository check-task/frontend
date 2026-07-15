import { cva } from 'styled-system/css';

const iconStyle = cva({
  base: {
    width: '1.75rem',
    height: '1.75rem',
    fill: 'none',
    stroke: 'gray.900',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
});

export const ChevronLineDownIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 28 28'
      className={iconStyle()}
    >
      <path d='M8 11L13.2929 16.2929C13.6834 16.6834 14.3166 16.6834 14.7071 16.2929L20 11' />
    </svg>
  );
};
