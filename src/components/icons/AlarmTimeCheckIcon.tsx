import { css } from 'styled-system/css';

export const AlarmTimeCheckIcon = () => {
  const pathStyle = css({
    stroke: 'blue.500',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <path
        d='M5 10L7.91731 14.376C8.11522 14.6728 8.55145 14.6728 8.74936 14.376L15 5'
        className={pathStyle}
      />
    </svg>
  );
};
