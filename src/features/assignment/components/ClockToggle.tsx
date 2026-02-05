'use client';

import { useState } from 'react';
import { ClockOnIcon } from '@/components/icons/ClockOnIcon';
import { ClockOffIcon } from '@/components/icons/ClockOffIcon';
import { css } from 'styled-system/css';

interface ClockToggleProps {
  muted?: boolean; // 여기도 공통이니까 불리언으로 처리
}

export const ClockToggle = ({ muted = false }: ClockToggleProps) => {
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
      {isOn ? <ClockOnIcon muted={muted} /> : <ClockOffIcon muted={muted} />}
    </button>
  );
};
