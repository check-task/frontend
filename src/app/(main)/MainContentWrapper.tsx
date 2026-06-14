'use client';

import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { css } from '../../../styled-system/css';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const SIDEBAR_CLOSED_WIDTH_REM = 3.75;
const WRAPPER_PADDING_REM = 1.5;

export const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const [centerOffset, setCenterOffset] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const calculateOffset = () => {
      if (!isSidebarCollapsed) {
        setCenterOffset(0);
        return;
      }

      const rootFontSize = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const sidebarCenterOffset = (SIDEBAR_CLOSED_WIDTH_REM * rootFontSize) / 2;
      const wrapperPadding = WRAPPER_PADDING_REM * rootFontSize;
      const firstChild = wrapper.firstElementChild;
      const childWidth =
        firstChild instanceof HTMLElement
          ? firstChild.getBoundingClientRect().width
          : wrapper.clientWidth;
      const contentWidth = wrapper.clientWidth - wrapperPadding * 2;
      const spareSpace = Math.max((contentWidth - childWidth) / 2, 0);

      setCenterOffset(Math.min(sidebarCenterOffset, spareSpace));
    };

    calculateOffset();

    const resizeObserver = new ResizeObserver(calculateOffset);
    resizeObserver.observe(wrapper);
    if (wrapper.firstElementChild) {
      resizeObserver.observe(wrapper.firstElementChild);
    }
    window.addEventListener('resize', calculateOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateOffset);
    };
  }, [isSidebarCollapsed, children]);

  return (
    <div
      ref={wrapperRef}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'safe center',
        pt: '5.25rem',
        width: '100%',
        px: '1.5rem',
        boxSizing: 'border-box',
        overflowX: 'auto',
      })}
      style={{ transform: `translateX(-${centerOffset}px)` }}
    >
      {children}
    </div>
  );
};
