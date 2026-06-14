'use client';

import { useUIStore } from '@/stores/ui-store';
import { css } from '../../../styled-system/css';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const SIDEBAR_OPEN_WIDTH = '15rem';
const SIDEBAR_CLOSED_WIDTH = '3.75rem';

export const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div
      className={css({
        // width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: '5.25rem',
        // 사이드바가 접혀있을 때는 전체 화면 기준으로 중앙 정렬하기 위해 사이드바 너비만큼 왼쪽으로 이동
        // 사이드바가 펼쳐져있을 때는 main 영역 기준으로 중앙 정렬
        // marginLeft: isSidebarCollapsed ? '0' : '7.5rem',
        // transition: 'margin-left 0.3s ease',

        // 사이드바 상태에 따라 너비를 다르게 설정
        // width: isSidebarCollapsed
        //   ? '100%'
        //   : `calc(100% - ${SIDEBAR_OPEN_WIDTH})`,
        width: '100%',
        // marginLeft: isSidebarCollapsed ? '0' : SIDEBAR_OPEN_WIDTH,
        marginX: 'auto',

        transition:
          'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      })}
    >
      {children}
    </div>
  );
};
