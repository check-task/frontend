'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { MonthPickerIcon } from '@/components/icons/MonthPickerIcon';
import MonthPicker from '@/components/MonthPicker';

export const DateSelectorWithPicker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <DateSelector onClick={togglePicker}>
        <DateTitle>2026년 1월</DateTitle>
        <MonthPickerIcon />
      </DateSelector>
      {isOpen && (
        <PickerWrapper>
          <MonthPicker />
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
