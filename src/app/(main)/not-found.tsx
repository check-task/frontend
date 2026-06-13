'use client';

import { css } from 'styled-system/css';
import NotFound from '../not-found';

export default function MainNotFound() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: 0,
        zIndex: 'modal',
      })}
    >
      <NotFound />
    </div>
  );
}
