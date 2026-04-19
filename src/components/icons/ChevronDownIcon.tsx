import { css } from 'styled-system/css';

export const ChevronDownIcon = () => {
  // 다크 모드시 색상 변경때문에 추가
  const iconStyle = css({
    fill: 'gray.700',
    stroke: 'gray.700',
    strokeWidth: '1.16667',
    strokeLinecap: 'round',
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
    >
      <path
        d='M19.5917 11.666C20.1114 11.666 20.3717 12.2943 20.0042 12.6618L14.825 17.8411C14.3693 18.2967 13.6307 18.2967 13.175 17.8411L7.99581 12.6618C7.62833 12.2943 7.8886 11.666 8.40829 11.666H19.5917Z'
        className={iconStyle}
      />
    </svg>
  );
};
