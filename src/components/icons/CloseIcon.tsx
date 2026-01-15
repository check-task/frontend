import { css } from 'styled-system/css';

export const CloseIcon = () => {
  const pathStyle = css({
    stroke: 'gray.900',
    strokeWidth: '1.16667',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
    >
      <path d='M21 7L7 21' className={pathStyle} />
      <path d='M7 7L21 21' className={pathStyle} />
    </svg>
  );
};
