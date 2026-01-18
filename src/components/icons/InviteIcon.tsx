import { css } from 'styled-system/css';

export const InviteIcon = () => {
  const iconStyle = css({
    stroke: 'blue.600',
    strokeWidth: '0.833333',
  });
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <circle cx='14.9997' cy='5.00065' r='1.66667' className={iconStyle} />
      <circle cx='14.9997' cy='15.0007' r='1.66667' className={iconStyle} />
      <circle cx='4.99967' cy='10.0007' r='1.66667' className={iconStyle} />
      <path d='M6.66699 9.16732L13.3337 5.83398' className={iconStyle} />
      <path d='M6.66699 10.8327L13.3337 14.166' className={iconStyle} />
    </svg>
  );
};
