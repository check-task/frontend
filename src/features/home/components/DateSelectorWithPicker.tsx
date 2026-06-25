'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import MonthPicker from '@/components/MonthPicker';
import { useCalendarStore } from '@/stores/calendar-store';
import { useUIStore } from '@/stores/ui-store';
import { useClickOutside } from '@/hooks/useClickOutside';
import { LeftIcon } from '@/components/icons/LeftIcon';
import { RightIcon } from '@/components/icons/RightIcon';

export const DateSelectorWithPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const setDate = useCalendarStore((state) => state.setDate);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const moveMonth = (direction: -1 | 1) => {
    const nextDate = new Date(currentYear, currentMonth - 1 + direction, 1);
    setDate(nextDate.getFullYear(), nextDate.getMonth() + 1);
  };

  const moveToToday = () => {
    const today = new Date();
    setDate(today.getFullYear(), today.getMonth() + 1);
  };

  // monthpicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={pickerRef} className={containerStyle}>
      <div className={selectorRowStyle(isSidebarCollapsed)}>
        <div className={dateControlStyle}>
          <button className={dateSelectorStyle} onClick={togglePicker}>
            <h1 className={dateTitleStyle}>
              {currentYear}년 {currentMonth}월
            </h1>
          </button>
          <div className={monthControlStyle}>
            <button
              type='button'
              className={monthButtonStyle}
              onClick={() => moveMonth(-1)}
              aria-label='이전 달'
            >
              <LeftIcon size='xl' />
            </button>
            <button
              type='button'
              className={monthButtonStyle}
              onClick={() => moveMonth(1)}
              aria-label='다음 달'
            >
              <RightIcon size='xl' />
            </button>
          </div>
        </div>
        <button
          type='button'
          className={todayButtonStyle}
          onClick={moveToToday}
        >
          오늘 날짜로 이동
        </button>
      </div>
      {isOpen && (
        <div className={pickerWrapperStyle}>
          <MonthPicker onClose={closePicker} />
        </div>
      )}
    </div>
  );
};

const containerStyle = css({
  position: 'relative',
  flex: 1,
  minWidth: 0,
});

const selectorRowStyle = (isSidebarCollapsed: boolean) =>
  css(
    hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '46.125rem',
      pr: isSidebarCollapsed ? '0.75rem' : '1rem',
      transition: 'padding-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
  );

const dateControlStyle = css(
  hstack.raw({
    gap: '0.5rem',
    alignItems: 'center',
    flexShrink: 0,
  }),
);

const dateSelectorStyle = css(
  hstack.raw({
    alignItems: 'center',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  }),
);

const dateTitleStyle = css({
  textStyle: 'h1',
  color: 'gray.900',
  width: '11.25rem',
  textAlign: 'left',
});

const monthControlStyle = css({
  display: 'flex',
  alignItems: 'center',
});

const monthButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
});

const todayButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingX: '0.75rem',
  paddingY: '0.25rem',
  bg: 'blue.50',
  border: '0.0625rem solid',
  borderColor: 'blue.300',
  borderRadius: '0.25rem',
  textStyle: 'body1.r',
  color: 'blue.300',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
});

const pickerWrapperStyle = css({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,
  zIndex: 'dropdown',
});
