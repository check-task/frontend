import { css } from 'styled-system/css';

export const ClockOnIcon = () => {
  const iconStyle = css({
    stroke: 'blue.500',
    strokeWidth: '1.33333',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      className={iconStyle}
    >
      <circle cx='15.9998' cy='17.3333' r='9.33333' strokeWidth='1.33333' />
      <path d='M9.3335 5.33398L5.3335 9.33398' />
      <path d='M22.6665 5.33398L26.6665 9.33398' />
      <path d='M16 10.666V17.3327L20 22.666' />
    </svg>
  );
};
