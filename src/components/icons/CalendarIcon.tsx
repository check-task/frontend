import { css } from 'styled-system/css';

interface CalendarIconProps {
  muted?: boolean;
}

export const CalenderIcon = ({ muted = false }: CalendarIconProps) => {
  // 체크 상태에 따라 색상 변경 추가
  const color = muted ? 'gray.400' : 'gray.600';
  const iconStyle = css({
    width: '2rem',
    height: '2rem',

    '& path, & rect': {
      stroke: color,
      strokeLinecap: 'round',
    },
    '& circle': {
      fill: color,
    },
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      className={iconStyle}
    >
      <path d='M20 10H4' />
      <rect
        x='20'
        y='6'
        width='14'
        height='16'
        rx='1'
        transform='rotate(90 20 6)'
      />
      <circle cx='8' cy='13' r='1' />
      <circle cx='12' cy='13' r='1' />
      <circle cx='16' cy='13' r='1' />
      <circle cx='8' cy='17' r='1' />
      <circle cx='12' cy='17' r='1' />
      <circle cx='16' cy='17' r='1' />
      <path d='M8 4V6' />
      <path d='M16 4V6' />
    </svg>
  );
};
