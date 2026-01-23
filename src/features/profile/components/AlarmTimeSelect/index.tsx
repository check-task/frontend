'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { AlarmTimeSelectMenu } from './AlarmTimeSelectMenu';
import { useClickOutside } from '@/hooks/useClickOutside';

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

  // 커스텀 훅 사용해서 외부 클릭시 닫기 처리
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <StyledButton.Select onMouseDown={handleToggle}>
        {selectedHour}시간 전
        <div className={iconWrapperStyle(isOpen)}>
          <ChevronDownIcon />
        </div>
      </StyledButton.Select>

      {/* 드롭다운 메뉴가 열린 경우 */}
      {isOpen && (
        <AlarmTimeSelectMenu
          onSelect={handleSelect}
          // onClose={() => setIsOpen(false)}
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

// 작성해주신 토글 위아래 전환 코드 부분만 뜯어옴
const iconWrapperStyle = (isOpen: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
  });
