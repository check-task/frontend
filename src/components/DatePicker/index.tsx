'use client';

import { useEffect, useState } from 'react';
import { CalenderIcon } from '../icons/CalendarIcon';
import { css, cva } from 'styled-system/css';
import CalendarModal from './CalendarModal';
import { useClickOutside } from '@/hooks/useClickOutside';

type BaseDatePickerProps = {
  maxDate?: string | Date;
  muted?: boolean; // 데이트 피커는 공용이니까 불리언으로 처리
  showTimeDisplay?: boolean; // 시간 표시 여부
  initialTimeEnabled?: boolean; // 시간 토글 초기 상태
  initialUnspecifiedSelected?: boolean; // 저장된 날짜 미지정 상태 표시 여부
};

type RequiredDatePickerProps = BaseDatePickerProps & {
  allowUnspecified?: false;
  value?: string | Date;
  onChange?: (date: Date, timeEnabled: boolean) => void;
};

type NullableDatePickerProps = BaseDatePickerProps & {
  allowUnspecified: true;
  value?: string | Date | null;
  onChange?: (date: Date | null, timeEnabled: boolean) => void;
};

type DatePickerProps = RequiredDatePickerProps | NullableDatePickerProps;

// 날짜 문자열로 온거 Date 객체로 변환 처리
const parseDate = (value?: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  // 이미 시간이 포함된 문자열(YYYY-MM-DDTHH:mm:ss)은 그대로 파싱
  const parsed = new Date(value.includes('T') ? value : `${value}T00:00:00`);
  return parsed;
};

export default function DatePicker({
  value,
  onChange,
  maxDate,
  muted = false,
  showTimeDisplay = false,
  initialTimeEnabled = false,
  initialUnspecifiedSelected = false,
  allowUnspecified = false,
}: DatePickerProps) {
  // ======= 상태 정의 =======
  const [isOpen, setIsOpen] = useState(false);
  // 확정된 날짜 (기본값: 오늘, 날짜 미지정 허용 시 null 가능)
  const [confirmedDate, setConfirmedDate] = useState<Date | null>(
    parseDate(value) ?? (allowUnspecified ? null : new Date()),
  );
  const [confirmedUnspecifiedSelected, setConfirmedUnspecifiedSelected] =
    useState(allowUnspecified && initialUnspecifiedSelected);
  // 시간 추가 여부
  const [timeEnabled, setTimeEnabled] = useState(initialTimeEnabled);

  // datepicker 외 화면 클릭하면 닫히도록 처리.
  const pickerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  // 동기화 코드 추가
  useEffect(() => {
    const next = parseDate(value);
    if (next) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmedDate(next);
      setConfirmedUnspecifiedSelected(false);
      return;
    }

    if (allowUnspecified) {
      setConfirmedDate(null);
      setConfirmedUnspecifiedSelected(Boolean(initialUnspecifiedSelected));
    }
  }, [allowUnspecified, initialUnspecifiedSelected, value]);

  // 선택한 날짜 저장
  const handleSave = (date: Date | null, withTime: boolean) => {
    setConfirmedDate(date);
    setConfirmedUnspecifiedSelected(allowUnspecified && date === null);
    setTimeEnabled(date ? withTime : false);

    if (allowUnspecified) {
      (onChange as NullableDatePickerProps['onChange'])?.(
        date,
        date ? withTime : false,
      );
    } else if (date) {
      (onChange as RequiredDatePickerProps['onChange'])?.(date, withTime);
    }

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

  const formatTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const p = h < 12 ? '오전' : '오후';
    const h12 = h % 12 || 12;
    return `${p} ${h12}:${String(m).padStart(2, '0')}`;
  };

  const parsedMaxDate = parseDate(maxDate);

  return (
    <div ref={pickerRef} className={containerStyle}>
      {/* 캘린더 아이콘 버튼 처리 */}
      <button
        type='button'
        className={css({
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 아이콘으로 체크 상태 여부 전송 */}
        <CalenderIcon muted={muted} />
      </button>
      <div>
        <button
          type='button'
          className={dateTextStyle({ muted })}
          // 숫자부분도 클릭시 열리도록
          onClick={() => setIsOpen(!isOpen)}
        >
          {confirmedDate ? formatDate(confirmedDate) : '지정안함'}
        </button>
      </div>

      {/* 시간 추가 시 구분선 + 시간 텍스트 표시 (showTimeDisplay=true인 페이지에서만) */}
      {showTimeDisplay && timeEnabled && confirmedDate && (
        <>
          <span className={separatorStyle} />
          <button
            type='button'
            className={timeTextStyle}
            onClick={() => setIsOpen(!isOpen)}
          >
            {formatTime(confirmedDate)}
          </button>
        </>
      )}

      {/* 달력 모달 */}
      {isOpen && (
        <CalendarModal
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
          initialDate={confirmedDate}
          maxDate={parsedMaxDate ?? undefined}
          initialTimeEnabled={timeEnabled}
          initialUnspecifiedSelected={confirmedUnspecifiedSelected}
          allowUnspecified={allowUnspecified}
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
    cursor: 'pointer',
    fontVariantNumeric: 'normal',
    display: 'inline-flex',
    alignItems: 'center',
    width: '4.8rem',
    textAlign: 'left',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
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

// 날짜-시간 구분선
const separatorStyle = css({
  display: 'inline-block',
  width: '1px',
  height: '1.125rem',
  flexShrink: 0,
  backgroundColor: 'gray.600',
  borderRadius: '9999px',
});

// 시간 텍스트 스타일
const timeTextStyle = css({
  textStyle: 'body1.r',
  cursor: 'pointer',
  color: 'gray.600',
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'normal',
});
