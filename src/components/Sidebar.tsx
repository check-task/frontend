'use client';

import { createPortal } from 'react-dom';
import { AssignmentButton } from './AssignmentButton';
import { HomeButton } from './HomeButton';
import { SidebarLogoButton } from './SidebarLogoButton';
import { CompletedAssignmentButton } from './CompletedAssignmentButton';
import { MyInfoButton } from './MyInfoButton';
import { NoticeButton } from './NoticeButton';
import { ModeSwitchToggle } from './ModeSwitchToggle';
import { LogoutButton } from './LogoutButton';
import { css, cva } from 'styled-system/css';
import { SidebarCloseButton } from './SidebarCloseButton';
import { useEffect, useState, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { SidebarHooks } from './SidebarHooks';
import { SidebarClicked } from './SidebarClicked';

interface SidebarProps {
  initialCollapsed: boolean;
  initialTheme: 'light' | 'dark';
}

const SIDEBAR_WIDTH_COLLAPSED = '3.75rem';
const SIDEBAR_WIDTH_EXPANDED = '15rem';

export const Sidebar = ({ initialCollapsed, initialTheme }: SidebarProps) => {
  // 서버 초기값을 로컬 상태로 관리
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const assignmentRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setIsDropdownOpen(false);
    if (isHydrated) {
      setSidebarCollapsed(false);
    } else {
      setIsCollapsed(false);
    }
  };

  const handleToggle = () => {
    if (isSidebarCollapsed) {
      handleExpand();
    } else {
      handleCollapse();
    }
  };

  const handleAssignmentClick = () => {
    if (!isSidebarCollapsed) return;
    if (!isDropdownOpen && assignmentRef.current) {
      const rect = assignmentRef.current.getBoundingClientRect();
      setDropdownTop(rect.top);
    }
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        assignmentRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const sidebarWidth = isSidebarCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED;

  return (
    <div className={sidebarStyleVariant({ collapsed: isSidebarCollapsed })}>
      <div className={headerStyle}>
        <SidebarLogoButton onClick={handleToggle} />
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
        <HomeButton collapsed={isSidebarCollapsed} />
        <div ref={assignmentRef} className={assignmentBlockStyle}>
          <AssignmentButton
            collapsed={isSidebarCollapsed}
            isOpen={isAssignmentOpen}
            onClick={
              isSidebarCollapsed
                ? handleAssignmentClick
                : () => setIsAssignmentOpen((prev) => !prev)
            }
          />
          <SidebarHooks
            collapsed={isSidebarCollapsed}
            isOpen={isAssignmentOpen}
          />
        </div>
        <CompletedAssignmentButton collapsed={isSidebarCollapsed} />
        <MyInfoButton collapsed={isSidebarCollapsed} />
        <NoticeButton collapsed={isSidebarCollapsed} />
        <ModeSwitchToggle collapsed={isSidebarCollapsed} />
      </div>

      <LogoutButton collapsed={isSidebarCollapsed} />

      {typeof window !== 'undefined' &&
        isSidebarCollapsed &&
        isDropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={dropdownPanelStyle}
            style={{
              left: sidebarWidth,
              top: dropdownTop,
            }}
          >
            <SidebarClicked onClose={() => setIsDropdownOpen(false)} />
          </div>,
          document.body,
        )}
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
    borderRight: '1px solid',
    borderRightColor: 'gray.100',
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
        w: '3.75rem', // 접힌 상태: 아이콘 + padding
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

const assignmentBlockStyle = css({
  position: 'relative',
});

const dropdownPanelStyle = css({
  position: 'fixed',
  zIndex: 'dropdown',
  transform: 'translateY(-14)',
  pl: 0,
  pr: '0.5rem',
  py: '0.5rem',
});
