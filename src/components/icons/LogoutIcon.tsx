import { css } from 'styled-system/css';

export const LogoutIcon = () => {
  const pathStyle = css({
    stroke: 'gray.500',
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
      <path
        d='M11 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H11'
        className={pathStyle}
      />
      <path d='M10 12L20 12' className={pathStyle} />
      <path
        d='M17 8L20.2929 11.2929C20.6834 11.6834 20.6834 12.3166 20.2929 12.7071L17 16'
        className={pathStyle}
      />
    </svg>
  );
};
