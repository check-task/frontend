import { css } from 'styled-system/css';

export const UndoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    className={css({ color: 'blue.600' })}
  >
    <path
      d="M4 11H16.2285C17.1647 11 18.0473 11.4371 18.6148 12.1819C19.433 13.2559 19.433 14.7441 18.6148 15.8181C18.0473 16.5629 17.1647 17 16.2285 17H14.2857"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M8 7L4 11L8 15"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);
