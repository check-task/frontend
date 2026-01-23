'use client';

import { useState, useRef, useEffect } from 'react';
import { CalenderIcon } from '../icons/CalendarIcon';
import { css } from 'styled-system/css';
import CalendarModal from './CalendarModal';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function DatePicker() {
  // ======= 상태 정의 =======
  const [isOpen, setIsOpen] = useState(false);
  // 확정된 날짜 (기본값: 오늘)
  const [confirmedDate, setConfirmedDate] = useState<Date>(new Date());

  // datepicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 선택한 날짜 저장
  const handleSave = (date: Date) => {
    setConfirmedDate(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\s/g, '')
      .slice(0, -1);
  };

  return (
    <div ref={pickerRef} className={containerStyle}>
      {/* 캘린더 아이콘 버튼 처리 */}
      <button
        type='button'
        className={css({ cursor: 'pointer' })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalenderIcon />
      </button>
      <div>
        <span className={dateTextStyle}>{formatDate(confirmedDate)}</span>
      </div>

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
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
});

// 날짜 글자 스타일
const dateTextStyle = css({
  textStyle: 'body1.r',
  color: 'gray.600',
  cursor: 'default',
});
