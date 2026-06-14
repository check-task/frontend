'use client';

import { useUIStore } from '@/stores/ui-store';
import { css } from '../../../styled-system/css';

interface MainContentWrapperProps {
  children: React.ReactNode;
}
const SIDEBAR_CLOSED_CENTER_OFFSET = '1.875rem';

export const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div
      className={css({
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
        transform: isSidebarCollapsed
          ? `translateX(-${SIDEBAR_CLOSED_CENTER_OFFSET})`
          : 'translateX(0)',
        '@media (max-width: 82.5rem)': {
          transform: 'translateX(0)',
        },
      })}
    >
      {children}
    </div>
  );
};
