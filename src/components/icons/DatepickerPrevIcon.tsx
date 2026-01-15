import { css } from 'styled-system/css';

export const DatepickerPrevIcon = () => {
  const iconStyle = css({
    width: '1.5rem',
    height: '1.5rem',
    stroke: 'gray.900',
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
        d='M14 6L8.70711 11.2929C8.31658 11.6834 8.31658 12.3166 8.70711 12.7071L14 18'
        className={iconStyle}
      />
    </svg>
  );
};
