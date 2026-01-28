import { css } from 'styled-system/css';

export const AddIcon = () => {
  const iconStyle = css({
    stroke: 'gray.700',
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
      <path d='M4 12H20' className={iconStyle} />
      <path d='M12 4V20' className={iconStyle} />
    </svg>
  );
};
