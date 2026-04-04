'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { MonthPickerIcon } from '@/components/icons/MonthPickerIcon';
import MonthPicker from '@/components/MonthPicker';
import { useCalendarStore } from '@/stores/calendar-store';
import { useClickOutside } from '@/hooks/useClickOutside';

export const DateSelectorWithPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  // monthpicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={pickerRef} className={containerStyle}>
      <button className={dateSelectorStyle} onClick={togglePicker}>
        <h1 className={dateTitleStyle}>
          {currentYear}년 {currentMonth}월
        </h1>
        <div className={iconWrapperStyle(isOpen)}>
          <MonthPickerIcon />
        </div>
      </button>
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

const dateSelectorStyle = css(
  hstack.raw({
    gap: '0.25rem',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  }),
);

const dateTitleStyle = css({
  textStyle: 'h1',
  color: 'gray.900',
});

const pickerWrapperStyle = css({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,
  zIndex: 'dropdown',
});

// 작성해주신 토글 위아래 전환 코드 부분만 뜯어옴
const iconWrapperStyle = (isOpen: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  });
