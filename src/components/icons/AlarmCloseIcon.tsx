import { css } from 'styled-system/css';

const pathStyle = css({
  stroke: 'gray.600',
  strokeWidth: '1.5',
  strokeLinecap: 'round',
});

export const AlarmCloseIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='36'
      height='36'
      viewBox='0 0 36 36'
      fill='none'
    >
      <path d='M27 9L9 27' className={pathStyle} />
      <path d='M9 9L27 27' className={pathStyle} />
    </svg>
  );
};
