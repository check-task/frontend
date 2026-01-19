import { css } from 'styled-system/css';

export const MonthPickerIcon = () => {
  const iconStyle = css({
    stroke: 'gray.900',
  });
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
    >
      <path
        d='M36 20L25.4142 30.5858C24.6332 31.3668 23.3668 31.3668 22.5858 30.5858L12 20'
        className={iconStyle}
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
};
