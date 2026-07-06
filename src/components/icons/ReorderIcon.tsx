import { css } from 'styled-system/css';

export const ReorderIcon = ({ size = 28 }: { size?: number }) => {
  const circleStyle = css({ fill: 'gray.100' });
  const strokeStyle = css({
    stroke: 'gray.400',
    strokeWidth: '1.16667',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 28 28'
      fill='none'
    >
      <rect width='28' height='28' rx='14' className={circleStyle} />
      <path
        d='M9.33333 10.5L13.0101 6.82328C13.5568 6.27655 14.4432 6.27655 14.99 6.82328L18.6667 10.5'
        className={strokeStyle}
      />
      <path
        d='M9.33333 17.5L13.0101 21.1767C13.5568 21.7235 14.4432 21.7235 14.99 21.1767L18.6667 17.5'
        className={strokeStyle}
      />
      <path d='M16.3333 14L11.6667 14' className={strokeStyle} />
    </svg>
  );
};
