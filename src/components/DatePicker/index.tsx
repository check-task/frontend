'use client';

import { useState } from 'react';
import { CalenderIcon } from '../icons/CalendarIcon';
import { css } from 'styled-system/css';
import CalendarModal from './CalendarModal';

export default function DatePicker() {
  // ======= 상태 정의 =======
  const [isOpen, setIsOpen] = useState(false);
  // 확정된 날짜 (기본값: 오늘)
  const [confirmedDate, setConfirmedDate] = useState<Date>(new Date());

  const handleSave = (date: Date) => {
    setConfirmedDate(date);
    setIsOpen(false);
    console.log(`확정된 날짜 확인: ${date.toLocaleDateString()}`);
  };

  return (
    <div className={containerStyle}>
      {/* 캘린더 아이콘 버튼 처리 */}
      <button
        type='button'
        className={css({ cursor: 'pointer' })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalenderIcon />
      </button>

      {/* 달력 모달 */}
      {isOpen && (
        <CalendarModal
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
          initialDate={confirmedDate}
        />
      )}
    </div>
  );
}

// ======= 스타일 정의 =======
// 버튼과 모달 전체 컨테이너
const containerStyle = css({
  position: 'relative',
  display: 'inline-block',
});
