import { css } from 'styled-system/css';

export const DropdownIcon = () => {
  const iconStyle = css({
    fill: 'gray.900',
    stroke: 'gray.900',
    strokeWidth: '0.833333',
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
        d='M13.9941 8.33398C14.3653 8.33398 14.5512 8.78279 14.2887 9.04528L10.5893 12.7447C10.2638 13.0702 9.73618 13.0702 9.41074 12.7447L5.7113 9.04528C5.44881 8.78279 5.63471 8.33398 6.00592 8.33398H13.9941Z'
        className={iconStyle}
      />
    </svg>
  );
};
