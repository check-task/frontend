import { token } from 'styled-system/tokens';

export const FolderCheckMark = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
    >
      <path
        d='M7 14L11.0842 20.1263C11.3613 20.542 11.972 20.542 12.2491 20.1263L21 7'
        stroke={token('colors.blue.100')}
        strokeWidth='1.4'
        strokeLinecap='round'
      />
    </svg>
  );
};
