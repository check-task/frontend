import { css } from 'styled-system/css';

export const SlideIcon = () => {
  const pathStyle = css({
    stroke: 'blue.600',
    strokeWidth: '1.5',
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
      <rect x='3' y='5' width='18' height='14' rx='1' className={pathStyle} />
      <path d='M9 5V19' className={pathStyle} />
    </svg>
  );
};
