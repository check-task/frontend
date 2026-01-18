'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { AlarmTimeSelectMenu } from './AlarmTimeSelectMenu';

interface AlarmTimeSelectProps {
  defaultValue?: number;
}

export const AlarmTimeSelect = ({
  defaultValue = 24,
}: AlarmTimeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(defaultValue);

  // 시간 선택 핸들러
  const handleSelect = (hour: number) => {
    setSelectedHour(hour);
    setIsOpen(false);
  };

  // 메뉴 열고 닫기 핸들러
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledButton.Select onMouseDown={handleToggle}>
        {selectedHour}시간 전 <ChevronDownIcon />
      </StyledButton.Select>

      {/* 드롭다운 메뉴가 열린 경우 */}
      {isOpen && (
        <AlarmTimeSelectMenu
          onSelect={handleSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// ======== 스타일 정의 ========
// 작성해주신 버튼 스타일 중 Select 부분만 뜯어옴
const StyledButton = {
  Select: styled('button', {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      textStyle: 'body1.m',
      color: 'gray.700',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
  }),
};
