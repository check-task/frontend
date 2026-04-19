import { css } from 'styled-system/css';

export const CompletedAssignmentIcon = () => {
  const pathStyle = css({
    stroke: 'blue.600',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
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
        d='M28.5 12.75V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5H21.9375M28.5 12.75L21.9375 4.5M28.5 12.75H23.4375C22.6091 12.75 21.9375 12.0784 21.9375 11.25V4.5'
        className={pathStyle}
      />
      <path
        d='M13.5 21L15.876 24.5639C16.1728 25.0092 16.8272 25.0092 17.124 24.5639L22.5 16.5'
        className={pathStyle}
      />
    </svg>
  );
};
