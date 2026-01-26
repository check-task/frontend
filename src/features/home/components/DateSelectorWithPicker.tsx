'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
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
    <Container ref={pickerRef}>
      <DateSelector onClick={togglePicker}>
        <DateTitle>
          {currentYear}년 {currentMonth}월
        </DateTitle>
        <div className={iconWrapperStyle(isOpen)}>
          <MonthPickerIcon />
        </div>
        {/* <MonthPickerIcon /> */}
      </DateSelector>
      {isOpen && (
        <PickerWrapper>
          <MonthPicker onClose={closePicker} />
        </PickerWrapper>
      )}
    </Container>
  );
};

const Container = styled('div', {
  base: {
    position: 'relative',
  },
});

const DateSelector = styled('button', {
  base: hstack.raw({
    gap: '0.25rem',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  }),
});

const DateTitle = styled('h1', {
  base: {
    textStyle: 'h1',
    color: 'gray.900',
  },
});

const PickerWrapper = styled('div', {
  base: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    left: 0,
    zIndex: 'dropdown',
  },
});

// 작성해주신 토글 위아래 전환 코드 부분만 뜯어옴
const iconWrapperStyle = (isOpen: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
  });
