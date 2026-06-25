'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import MonthPicker from '@/components/MonthPicker';
import { useCalendarStore } from '@/stores/calendar-store';
import { useClickOutside } from '@/hooks/useClickOutside';
import { LeftIcon } from '@/components/icons/LeftIcon';
import { RightIcon } from '@/components/icons/RightIcon';

export const DateSelectorWithPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const setDate = useCalendarStore((state) => state.setDate);

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

  // monthpicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={pickerRef} className={containerStyle}>
      <div className={selectorRowStyle}>
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
});

const selectorRowStyle = css(
  hstack.raw({
    gap: '0.5rem',
    alignItems: 'center',
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

const pickerWrapperStyle = css({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,
  zIndex: 'dropdown',
});
