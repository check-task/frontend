import { cva } from 'styled-system/css';

export const CommunicationEditIcon = () => {
  const pathStyle = cva({
    base: {
      stroke: 'gray.900',
      strokeWidth: '1.16667',
      strokeLinecap: 'round',
    },
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
        d='M18.1249 4.92547L7.36911 15.6812C7.17612 15.8742 7.0569 16.1288 7.03219 16.4006L6.70221 20.0304C6.63625 20.756 7.24412 21.3638 7.96971 21.2979L11.5995 20.9679C11.8713 20.9432 12.1259 20.824 12.3189 20.631L23.0746 9.87522C23.5302 9.4196 23.5302 8.68091 23.0746 8.2253L19.7748 4.92547C19.3192 4.46986 18.5805 4.46986 18.1249 4.92547Z'
        className={pathStyle()}
      />
      <path d='M7.40039 15.6499L12.3501 20.5997' className={pathStyle()} />
      <path d='M17.2998 5.75043L22.2496 10.7002' className={pathStyle()} />
    </svg>
  );
};
