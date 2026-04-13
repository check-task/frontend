import { css } from 'styled-system/css';

export const HomeIcon = () => {
  const pathStyle = css({
    stroke: 'blue.600',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='36'
      height='36'
      viewBox='0 0 36 36'
      fill='none'
    >
      <path
        d='M17.1 5.175L5.1 14.175C4.72229 14.4583 4.5 14.9029 4.5 15.375V30C4.5 30.8284 5.17157 31.5 6 31.5H13.125C13.9534 31.5 14.625 30.8284 14.625 30V22.875C14.625 22.0466 15.2966 21.375 16.125 21.375H19.875C20.7034 21.375 21.375 22.0466 21.375 22.875V30C21.375 30.8284 22.0466 31.5 22.875 31.5H30C30.8284 31.5 31.5 30.8284 31.5 30V15.375C31.5 14.9029 31.2777 14.4583 30.9 14.175L18.9 5.175C18.3667 4.775 17.6333 4.775 17.1 5.175Z'
        className={pathStyle}
      />
    </svg>
  );
};
