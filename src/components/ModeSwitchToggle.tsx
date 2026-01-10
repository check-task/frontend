'use client';

import { useState } from 'react';
import { cva } from '../../styled-system/css';
import { DarkModeIcon } from './icons/DarkModeIcon';
import { LightModeIcon } from './icons/LightModeIcon';

export const ModeSwitchToggle = () => {
  const [isLightMode, setIsLightMode] = useState(true);

  const toggleMode = () => {
    setIsLightMode((prev) => !prev);
  };

  const containerStyle = cva({
    base: {
      w: '6.25rem',
      h: '2.5rem',
      borderRadius: 'full',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '0.75rem',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'background-color 0.3s ease',
    },
    variants: {
      isLight: {
        true: {
          bg: 'blue.500',
        },
        false: {
          bg: 'blue.600',
        },
      },
    },
  });

  const iconContainerStyle = cva({
    base: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 2,
    },
    variants: {
      isLight: {
        true: {
          transform: 'translateX(calc(6.25rem - 0.75rem - 0.75rem - 1.75rem))',
          left: '0.75rem',
        },
        false: {
          transform: 'translateX(0)',
          left: '0.75rem',
        },
      },
    },
  });

  const lightTextStyle = cva({
    base: {
      textStyle: 'body3.m',
      transition: 'opacity 0.6s ease, color 0.3s ease',
      zIndex: 1,
      userSelect: 'none',
      position: 'absolute',
      left: '0.75rem',
    },
    variants: {
      isLight: {
        true: {
          opacity: 1,
          color: 'blue.50',
        },
        false: {
          opacity: 0,
          color: 'blue.50',
          pointerEvents: 'none',
        },
      },
    },
  });

  const darkTextStyle = cva({
    base: {
      textStyle: 'body3.m',
      transition: 'opacity 0.6s ease, color 0.3s ease',
      zIndex: 1,
      userSelect: 'none',
      position: 'absolute',
      right: '0.75rem',
    },
    variants: {
      isDark: {
        true: {
          opacity: 1,
          color: 'blue.100',
        },
        false: {
          opacity: 0,
          color: 'blue.600',
          pointerEvents: 'none',
        },
      },
    },
  });

  return (
    <button
      type='button'
      onClick={toggleMode}
      className={containerStyle({ isLight: isLightMode })}
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className={lightTextStyle({ isLight: isLightMode })}>LIGHT</span>
      <div className={iconContainerStyle({ isLight: isLightMode })}>
        {isLightMode ? <LightModeIcon /> : <DarkModeIcon />}
      </div>
      <span className={darkTextStyle({ isDark: !isLightMode })}>DARK</span>
    </button>
  );
};
