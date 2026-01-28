'use client';

import { AssignmentButton } from './AssignmentButton';
import { SidebarOpenButton } from './SidebarOpenButton';
import { CompletedAssignmentButton } from './CompletedAssignmentButton';
import { MyInfoButton } from './MyInfoButton';
import { ModeSwitchToggle } from './ModeSwitchToggle';
import { LogoutButton } from './LogoutButton';
import { css, cva } from 'styled-system/css';
import { SidebarCloseButton } from './SidebarCloseButton';
import { useEffect, useState, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';

interface SidebarProps {
  initialCollapsed: boolean;
  initialTheme: 'light' | 'dark';
}

export const Sidebar = ({ initialCollapsed, initialTheme }: SidebarProps) => {
  // 서버 초기값을 로컬 상태로 관리
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isHydrated, setIsHydrated] = useState(false);

  // Zustand store에서 액션과 상태 가져오기
  const storeCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  const setTheme = useUIStore((state) => state.setTheme);

  const isInitialized = useRef(false);

  // 클라이언트 hydration 후 Zustand store와 동기화
  useEffect(() => {
    if (!isInitialized.current) {
      // Zustand persist가 쿠키에서 상태를 복원할 때까지 대기
      const currentState = useUIStore.getState();

      // 서버 초기값으로 store 초기화 (persist가 쿠키 읽기 전)
      if (currentState.isSidebarCollapsed !== initialCollapsed) {
        setSidebarCollapsed(initialCollapsed);
      }

      if (currentState.theme !== initialTheme) {
        setTheme(initialTheme);
      }

      isInitialized.current = true;
      setTimeout(() => {
        setIsHydrated(true);
      }, 0);
    }
  }, [initialCollapsed, initialTheme, setSidebarCollapsed, setTheme]);

  // Hydration 후에는 Zustand store의 값 사용
  const isSidebarCollapsed = isHydrated ? storeCollapsed : isCollapsed;

  const handleCollapse = () => {
    if (isHydrated) {
      setSidebarCollapsed(true);
    } else {
      setIsCollapsed(true);
    }
  };

  const handleExpand = () => {
    if (isHydrated) {
      setSidebarCollapsed(false);
    } else {
      setIsCollapsed(false);
    }
  };

  return (
    <div className={sidebarStyleVariant({ collapsed: isSidebarCollapsed })}>
      <div className={headerStyle}>
        <SidebarOpenButton onClick={handleExpand} />
        <div
          style={{
            opacity: isSidebarCollapsed ? 0 : 1,
            width: isSidebarCollapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition:
              'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <SidebarCloseButton onClick={handleCollapse} />
        </div>
      </div>

      <div className={contentStyle}>
        <AssignmentButton collapsed={isSidebarCollapsed} />
        <CompletedAssignmentButton collapsed={isSidebarCollapsed} />
        <MyInfoButton collapsed={isSidebarCollapsed} />
        <ModeSwitchToggle collapsed={isSidebarCollapsed} />
      </div>

      <LogoutButton collapsed={isSidebarCollapsed} />
    </div>
  );
};

// 사이드바 스타일링
const sidebarStyleVariant = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    py: '2.5rem',
    px: '1rem',
    h: '100vh',
    borderRight: '0.0625rem solid',
    borderColor: 'gray.100',
    bg: 'bg',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 'banner',
  },
  variants: {
    collapsed: {
      true: {
        w: '4.5rem', // 접힌 상태: 아이콘 + padding
      },
      false: {
        w: '15rem', // 펼쳐진 상태: 아이콘 + 텍스트 + padding
      },
    },
  },
});

// 사이드바 헤더 스타일링
const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  w: '100%',
});

// 사이드바 컨텐츠 스타일링
const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
  flex: 1,
  mt: '2.5rem',
});
