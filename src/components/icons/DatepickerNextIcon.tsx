import { css } from 'styled-system/css';

export const DatepickerNextIcon = () => {
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
      className={iconStyle}
    >
      <path d='M10 6L15.2929 11.2929C15.6834 11.6834 15.6834 12.3166 15.2929 12.7071L10 18' />
    </svg>
  );
};
