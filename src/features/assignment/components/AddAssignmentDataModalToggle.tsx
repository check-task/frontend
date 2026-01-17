'use client';

import { useState, ReactNode } from 'react';
import { cva } from 'styled-system/css';

interface ToggleOption {
  label: string;
  icon?: (isActive: boolean) => ReactNode;
}

interface AddAssignmentDataModalToggleProps {
  options: [ToggleOption, ToggleOption];
  onToggle?: (index: number) => void;
}

export const AddAssignmentDataModalToggle = ({
  options,
  onToggle,
}: AddAssignmentDataModalToggleProps) => {
  const [active, setActive] = useState<0 | 1>(0);

  const handlePress = (index: 0 | 1) => {
    setActive(index);
    onToggle?.(index);
  };

  return (
    <div className={containerStyle()}>
      <div
        className={buttonStyle({ active: active === 0 })}
        onClick={() => handlePress(0)}
      >
        {options[0].icon && (
          <div className={iconWrapperStyle()}>
            {options[0].icon(active === 0)}
          </div>
        )}
        <span>{options[0].label}</span>
      </div>
      <div
        className={buttonStyle({ active: active === 1 })}
        onClick={() => handlePress(1)}
      >
        {options[1].icon && (
          <div className={iconWrapperStyle()}>
            {options[1].icon(active === 1)}
          </div>
        )}
        <span>{options[1].label}</span>
      </div>
    </div>
  );
};

// Container 스타일
const containerStyle = cva({
  base: {
    mt: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    bg: 'gray.100',
    borderRadius: '0.25rem',
    padding: '0.75rem 0.5rem',
    height: '2.25rem',
    gap: '0.625rem',
    transition: 'all 0.3s ease',
    width: '100%',
  },
});

// 버튼 스타일
const buttonStyle = cva({
  base: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    h: '1.75rem',
    borderRadius: '0.25rem',
    textStyle: 'body4.r',
    color: 'gray.900',
    cursor: 'pointer',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  variants: {
    active: {
      true: {
        color: 'gray.900',
        bg: 'gray.0',
      },
      false: {
        color: 'gray.500',
        backgroundColor: 'gray.100',
      },
    },
  },
});

// 아이콘 Wrapper 스타일
const iconWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
