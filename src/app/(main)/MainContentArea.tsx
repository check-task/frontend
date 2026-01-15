'use client';

import { useUIStore } from '@/stores/ui-store';
import { css } from '../../../styled-system/css';

interface MainContentAreaProps {
  children: React.ReactNode;
}

export const MainContentArea = ({ children }: MainContentAreaProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <main
      className={css({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        // 사이드바가 fixed -> main 영역에 사이드바 너비만큼 margin-left 추가
        marginLeft: isSidebarCollapsed ? '4.5rem' : '15rem',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      })}
    >
      {children}
    </main>
  );
};
