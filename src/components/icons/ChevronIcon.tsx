import { css } from 'styled-system/css';

export const ChevronIcon = () => {
  const pathStyle = css({
    stroke: 'blue.600',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        d='M18 10L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6 10'
        className={pathStyle}
      />
    </svg>
  );
};
