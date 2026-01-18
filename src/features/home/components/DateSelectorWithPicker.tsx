'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { MonthPickerIcon } from '@/components/icons/MonthPickerIcon';
import MonthPicker from '@/components/MonthPicker';
import { useCalendarStore } from '@/stores/calendar-store';

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

  return (
    <Container>
      <DateSelector onClick={togglePicker}>
        <DateTitle>
          {currentYear}년 {currentMonth}월
        </DateTitle>
        <MonthPickerIcon />
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
