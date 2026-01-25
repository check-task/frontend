import { css } from 'styled-system/css';

export const PencilIcon = () => {
  const iconStyle = css({
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
        d='M18.1249 4.92494L7.36911 15.6807C7.17612 15.8737 7.0569 16.1282 7.03219 16.4L6.70221 20.0298C6.63625 20.7554 7.24412 21.3633 7.96971 21.2973L11.5995 20.9674C11.8713 20.9426 12.1259 20.8234 12.3189 20.6304L23.0746 9.87468C23.5302 9.41907 23.5302 8.68038 23.0746 8.22477L19.7748 4.92493C19.3192 4.46932 18.5805 4.46932 18.1249 4.92494Z'
        className={iconStyle}
      />
      <path d='M7.40039 15.6504L12.3501 20.6001' className={iconStyle} />
      <path d='M17.2998 5.75L22.2496 10.6997' className={iconStyle} />
    </svg>
  );
};
