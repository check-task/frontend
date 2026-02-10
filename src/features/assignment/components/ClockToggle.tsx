'use client';

import { useState } from 'react';
import { ClockOnIcon } from '@/components/icons/ClockOnIcon';
import { ClockOffIcon } from '@/components/icons/ClockOffIcon';
import { css } from 'styled-system/css';

interface ClockToggleProps {
  muted?: boolean; // 여기도 공통이니까 불리언으로 처리
  isOn?: boolean;
  onToggle?: (next: boolean) => void;
}

export const ClockToggle = ({
  muted = false,
  isOn,
  onToggle,
}: ClockToggleProps) => {
  const [localOn, setLocalOn] = useState(false);
  const isActive = typeof isOn === 'boolean' ? isOn : localOn;

  const handleClick = () => {
    const next = !isActive;
    if (typeof isOn !== 'boolean') {
      setLocalOn(next);
    }

    onToggle?.(next);
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
      {isActive ? (
        <ClockOnIcon muted={muted} />
      ) : (
        <ClockOffIcon muted={muted} />
      )}
    </button>
  );
};
