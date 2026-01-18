'use client';

import { useState } from 'react';
import { ClockOnIcon } from '@/components/icons/ClockOnIcon';
import { ClockOffIcon } from '@/components/icons/ClockOffIcon';
import { css } from 'styled-system/css';

export const ClockToggle = () => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={css({
        cursor: 'pointer',
        display: 'flex',

        border: 'none',
        padding: 0,
      })}
    >
      {isOn ? <ClockOnIcon /> : <ClockOffIcon />}
    </button>
  );
};
