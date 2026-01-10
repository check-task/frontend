'use client';

import { css } from '../../../styled-system/css';

export default function Home() {
  return (
    <div
      className={css({
        fontSize: '2xl',
        fontWeight: 'bold',
        color: 'blue.500',
        bg: 'bg',
      })}
    >
      Home
    </div>
  );
}
