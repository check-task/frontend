'use client';

import { AssignmentButton } from './AssignmentButton';
import { SidebarOpenButton } from './SidebarOpenButton';
import { CompletedAssignmentButton } from './CompletedAssignmentButton';
import { MyInfoButton } from './MyInfoButton';
import { ModeSwitchToggle } from './ModeSwitchToggle';
import { LogoutButton } from './LogoutButton';
import { css, cva } from 'styled-system/css';
import { SidebarCloseButton } from './SidebarCloseButton';
import { useState } from 'react';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(true);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  return (
    <div className={sidebarStyleVariant({ collapsed: isCollapsed })}>
      <div className={headerStyle}>
        <SidebarOpenButton onClick={handleExpand} />
        <div
          style={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition:
              'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <SidebarCloseButton onClick={handleCollapse} />
        </div>
      </div>

      <div className={contentStyle}>
        <AssignmentButton collapsed={isCollapsed} />
        <CompletedAssignmentButton collapsed={isCollapsed} />
        <MyInfoButton collapsed={isCollapsed} />
        <ModeSwitchToggle collapsed={isCollapsed} />
      </div>

      <LogoutButton collapsed={isCollapsed} />
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
