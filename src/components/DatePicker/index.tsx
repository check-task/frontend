'use client';

import { useEffect, useState } from 'react';
import { CalenderIcon } from '../icons/CalendarIcon';
import { css, cva } from 'styled-system/css';
import CalendarModal from './CalendarModal';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DatePickerProps {
  value?: string | Date;
  onChange?: (date: Date) => void;
  muted?: boolean; // 데이트 피커는 공용이니까 불리언으로 처리
}

// 날짜 문자열로 온거 Date 객체로 변환 처리
const parseDate = (value?: string | Date) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return parsed;
};

export default function DatePicker({
  value,
  onChange,
  muted = false,
}: DatePickerProps) {
  // ======= 상태 정의 =======
  const [isOpen, setIsOpen] = useState(false);
  // 확정된 날짜 (기본값: 오늘)
  const [confirmedDate, setConfirmedDate] = useState<Date>(
    parseDate(value) ?? new Date(),
  );

  // datepicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  // 동기화 코드 추가
  useEffect(() => {
    const next = parseDate(value);
    if (next) {
      setConfirmedDate(next);
    }
  }, [value]);

  // 선택한 날짜 저장
  const handleSave = (date: Date) => {
    setConfirmedDate(date);
    onChange?.(date);
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
        className={css({
          cursor: 'pointer',
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 아이콘으로 체크 상태 여부 전송 */}
        <CalenderIcon muted={muted} />
      </button>
      <div>
        <span className={dateTextStyle({ muted })}>
          {formatDate(confirmedDate)}
        </span>
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
const dateTextStyle = cva({
  base: {
    textStyle: 'body1.r',
    cursor: 'default',
    fontVariantNumeric: 'tabular-nums',
  },
  variants: {
    muted: {
      true: { color: 'gray.400' },
      false: { color: 'gray.600' },
    },
  },
  defaultVariants: {
    muted: false,
  },
});
