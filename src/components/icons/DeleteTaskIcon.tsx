import { css } from 'styled-system/css';

export const DeleteTaskIcon = () => {
  const iconStyle = css({
    stroke: 'gray.600',
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
      <path d='M16 4L4 16' className={iconStyle} />
      <path d='M4 4L16 16' className={iconStyle} />
    </svg>
  );
};
