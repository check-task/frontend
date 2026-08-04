'use client';

import { cva } from 'styled-system/css';

interface TimeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function TimeToggle({
  checked,
  onChange,
  disabled = false,
}: TimeToggleProps) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={trackStyle({ checked, disabled })}
    >
      <span className={thumbStyle({ checked })} />
    </button>
  );
}

const trackStyle = cva({
  base: {
    position: 'relative',
    display: 'inline-flex',
    width: '3rem',
    height: '1.5rem',
    borderRadius: '6.25rem',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    flexShrink: 0,
  },
  variants: {
    checked: {
      true: { bg: 'primary' },
      false: { bg: 'gray.300' },
    },
    disabled: {
      true: { bg: 'gray.100', cursor: 'not-allowed' },
    },
  },
  defaultVariants: { checked: false, disabled: false },
});

const thumbStyle = cva({
  base: {
    position: 'absolute',
    top: '0.25rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    bg: 'white',
    transition: 'left 0.2s ease',
  },
  variants: {
    checked: {
      true: { left: '1.75rem' },
      false: { left: '0.25rem' },
    },
  },
  defaultVariants: { checked: false },
});
