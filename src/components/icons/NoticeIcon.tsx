import { css, cx } from 'styled-system/css';

interface NoticeIconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const NoticeIcon = ({
  size = 36,
  color = 'blue.600',
  className,
}: NoticeIconProps) => {
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 36 36'
      fill='none'
      className={iconClassName}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.751 5.47642C21.1373 5.42017 21.9004 6.68337 21.9004 7.76158V28.2401C21.9004 29.3183 21.1373 30.5815 19.751 30.5253C17.8805 30.4492 16.2607 29.3878 14.9824 28.1004C13.6954 26.8043 12.6714 25.198 11.9854 23.8485C11.7701 23.4256 11.3645 23.1717 10.9492 23.1717H8.5498C7.14157 23.1716 6 22.0292 6 20.621V15.3807C6 13.9725 7.14157 12.83 8.5498 12.8299H10.9492C11.3646 12.8299 11.7701 12.5762 11.9854 12.1532C12.6714 10.8036 13.6954 9.19742 14.9824 7.90123C16.2607 6.61391 17.8805 5.55249 19.751 5.47642ZM19.8125 6.97545C18.4821 7.02943 17.2005 7.79713 16.0469 8.95884C14.9022 10.1117 13.9628 11.5748 13.3232 12.8329C12.8796 13.7053 11.9873 14.3299 10.9492 14.3299H8.5498C7.97 14.33 7.5 14.8009 7.5 15.3807V20.621C7.5 21.2008 7.97 21.6716 8.5498 21.6717H10.9492C11.9873 21.6717 12.8796 22.2964 13.3232 23.1688C13.9628 24.4268 14.9022 25.89 16.0469 27.0428C17.2005 28.2045 18.4821 28.9722 19.8125 29.0262C19.9589 29.0321 20.0862 28.9747 20.1963 28.8436C20.3147 28.7024 20.4004 28.4844 20.4004 28.2401V7.76158C20.4004 7.51724 20.3147 7.29923 20.1963 7.15806C20.0862 7.02699 19.9589 6.96958 19.8125 6.97545Z'
        fill='currentColor'
      />
      <path
        d='M25.5 13.5L28.5 10.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M25.5 22.5L28.5 25.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M25.5 18H30'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};
