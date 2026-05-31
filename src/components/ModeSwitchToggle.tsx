'use client';

import { useState, useEffect } from 'react';
import { cva } from '../../styled-system/css';
import { DarkModeIcon } from './icons/DarkModeIcon';
import { LightModeIcon } from './icons/LightModeIcon';
import { useTheme } from '@/providers/theme-provider';
import Image from 'next/image';

interface ModeSwitchToggleProps {
  collapsed?: boolean;
}
// 모드 스위치 토글 컴포넌트
export const ModeSwitchToggle = ({
  collapsed = false,
}: ModeSwitchToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLightMode = theme === 'light';

  // 마운트 상태 추적 (초기 애니메이션 방지)
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // 마운트 전까지 렌더링하지 않음
  if (!mounted) {
    return (
      <div
        style={{
          width: collapsed ? '2.5rem' : '6.0625rem',
          height: '2.5rem',
          visibility: 'hidden',
        }}
      />
    );
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className={containerStyle({
        isLight: isLightMode,
        collapsed,
        collapsedAndLight: collapsed && isLightMode,
        collapsedAndDark: collapsed && !isLightMode,
      })}
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        transition: collapsed
          ? 'width 0.3s ease'
          : 'background-color 0.3s ease, width 0.3s ease',
      }}
    >
      {' '}
      {/* 접힌 상태일 때는 텍스트 렌더링 안함 */}
      {!collapsed && (
        <>
          <span
            className={lightTextStyle({ isLight: isLightMode, collapsed })}
            style={{ transition: 'opacity 0.6s ease, color 0.3s ease' }}
          >
            LIGHT
          </span>
          <span
            className={darkTextStyle({ isDark: !isLightMode, collapsed })}
            style={{ transition: 'opacity 0.6s ease, color 0.3s ease' }}
          >
            DARK
          </span>
        </>
      )}
      {/* 아이콘 컨테이너 */}
      <div
        className={iconContainerStyle({
          isLight: isLightMode,
          collapsed,
          isLightAndExpanded: isLightMode && !collapsed,
        })}
        style={{
          transition: collapsed
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* 라이트 모드일 때는 라이트 모드 아이콘 렌더링 */}
        {/* 접힌 상태일 때는 다크 모드 아이콘 렌더링 */}
        {isLightMode ? (
          <LightModeIcon />
        ) : collapsed ? (
          <Image
            src='/DarkModeCollapsed.svg'
            alt='Dark Mode Collapsed Icon'
            width={28}
            height={28}
          />
        ) : (
          <DarkModeIcon />
        )}
      </div>
    </button>
  );
};

// 모드 스위치 토글 컨테이너 스타일링
const containerStyle = cva({
  base: {
    borderRadius: 'full',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
  },
  variants: {
    isLight: {
      true: {
        bg: 'blue.500',
      },
      false: {
        bg: 'blue.100',
      },
    },
    collapsed: {
      true: {
        w: '1.75rem',
        h: '1.75rem',
        px: '0',
        justifyContent: 'center',
      },
      false: {
        w: '6.0625rem',
        h: '2.5rem',
        px: '0.75rem',
      },
    },
    collapsedAndLight: {
      true: {
        bg: 'blue.50',
      },
      false: {},
    },
    collapsedAndDark: {
      true: {
        bg: 'blue.100',
      },
      false: {},
    },
  },
});

// 아이콘 컨테이너 스타일링
const iconContainerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  variants: {
    isLight: {
      true: {},
      false: {},
    },
    collapsed: {
      true: {
        position: 'relative',
        left: '0',
        transform: 'none',
      },
      false: {
        position: 'absolute',
        left: '0.5rem',
      },
    },
    isLightAndExpanded: {
      true: {
        transform: 'translateX(calc(6.0625rem - 0.5rem - 0.5rem - 1.75rem))',
      },
      false: {
        transform: 'translateX(0)',
      },
    },
  },
});

// 라이트 텍스트 스타일링
const lightTextStyle = cva({
  base: {
    textStyle: 'body3.m',
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
    collapsed: {
      true: {
        display: 'none',
      },
      false: {
        display: 'block',
      },
    },
  },
});

// 다크 텍스트 스타일링
const darkTextStyle = cva({
  base: {
    textStyle: 'body3.m',
    zIndex: 1,
    userSelect: 'none',
    position: 'absolute',
    right: '0.75rem',
  },
  variants: {
    isDark: {
      true: {
        opacity: 1,
        color: 'blue.600',
      },
      false: {
        opacity: 0,
        color: 'blue.600',
        pointerEvents: 'none',
      },
    },
    collapsed: {
      true: {
        display: 'none',
      },
      false: {
        display: 'block',
      },
    },
  },
});
