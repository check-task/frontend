import { css } from 'styled-system/css';

export const SaveIcon = () => {
  const iconStyle = css({
    stroke: 'blue.500',
    strokeWidth: '1.2',
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
        d='M4 10L7.50077 15.2512C7.73826 15.6074 8.26174 15.6074 8.49923 15.2512L16 4'
        className={iconStyle}
      />
    </svg>
  );
};
