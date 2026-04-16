'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { css } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { RightIcon } from '../icons/RightIcon';
import { LeftIcon } from '../icons/LeftIcon';
import { useState } from 'react';
import { Button } from '../Button';
import { TimeToggle } from '../TimeToggle';
import { useAlertStore } from '@/stores/alert-store';

interface CalenderModalProps {
  onClose: () => void;
  onSave: (date: Date, timeEnabled: boolean) => void;
  // 초기 날짜를 받기 위함
  initialDate: Date;
  // 세부 목록 날짜 선택시 이후 날짜 제한을 위해 추가
  maxDate?: Date;
  // 시간 추가 토글 초기값
  initialTimeEnabled?: boolean;
  // 시간 추가 토글 상태 변경 콜백
  onTimeToggle?: (enabled: boolean) => void;
}

export default function CalendarModal({
  onClose,
  onSave,
  initialDate,
  maxDate,
  initialTimeEnabled = false,
  onTimeToggle,
}: CalenderModalProps) {
  // 선택된 날짜
  const { showAlert } = useAlertStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  // 시간 추가 토글 상태
  const [timeEnabled, setTimeEnabled] = useState(initialTimeEnabled);
  // 시간 입력 상태 — 모달을 다시 열 때 저장된 시간 복원
  const [period, setPeriod] = useState<'오전' | '오후'>(() => {
    if (!initialTimeEnabled) return '오전';
    return initialDate.getHours() < 12 ? '오전' : '오후';
  });
  const [timeValue, setTimeValue] = useState(() => {
    if (!initialTimeEnabled) return '00:00';
    const h = initialDate.getHours() % 12 || 12;
    const m = initialDate.getMinutes();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length <= 2) {
      setTimeValue(raw);
    } else if (raw.length === 3) {
      // H:MM 형태
      setTimeValue(`${raw[0]}:${raw.slice(1)}`);
    } else {
      // HH:MM 형태
      setTimeValue(`${raw.slice(0, 2)}:${raw.slice(2)}`);
    }
  };

  // 시간 정규화
  const handleTimeBlur = () => {
    const raw = timeValue.trim();
    let h = 0,
      m = 0;

    if (raw.includes(':')) {
      const [hPart, mPart] = raw.split(':');
      h = parseInt(hPart) || 0;
      m = parseInt(mPart) || 0;
    } else {
      // 1~2자리만 입력하고 blur된 경우 (시간만, 분은 00)
      h = parseInt(raw) || 0;
      m = 0;
    }

    h = Math.max(0, h);
    m = Math.max(0, m);

    // 23시간 범위 초과 또는 분 초과 시 00:00으로 리셋
    if (h > 23 || m > 59) {
      setTimeValue('00:00');
      return;
    }

    // 24시간 형식 입력 시 자동으로 오전/오후 변환
    if (h >= 13) {
      setPeriod('오후');
      h = h - 12;
    } else if (h === 12) {
      setPeriod('오후');
    } else if (h === 0) {
      setPeriod('오전');
      h = 12;
    }

    setTimeValue(
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    );
  };

  const handleTimeToggle = (enabled: boolean) => {
    setTimeEnabled(enabled);
    onTimeToggle?.(enabled);
  };

  const formatKoreanDate = (date: Date) =>
    `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  const handleDateChange = (value: any) => {
    // 배열 말고 단일 선택만 고려
    if (value instanceof Date || value === null) {
      setSelectedDate(value);
    }
  };

  return (
    <div className={modalWrapper}>
      <Calendar
        locale='en-US'
        calendarType='gregory'
        onChange={handleDateChange}
        value={selectedDate}
        maxDate={maxDate}
        maxDetail='month' // 달 뷰로 고정
        minDetail='month'
        nextLabel={<RightIcon />}
        prevLabel={<LeftIcon />}
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleString('en', { weekday: 'narrow' })
        }
        showNeighboringMonth={true} // 기본이 true인데 한번 더 명시
        showFixedNumberOfWeeks={true} // 6주를 보여주는 프롭이 있음
      />
      <div className={timeSection}>
        <div className={timeToggleRow}>
          <span className={timeToggleLabel}>시간 추가</span>
          <TimeToggle checked={timeEnabled} onChange={handleTimeToggle} />
        </div>
        {timeEnabled && selectedDate && (
          <div className={dateTimeRow}>
            <span className={dateLabel}>{formatKoreanDate(selectedDate)}</span>
            <div className={timeInputBox}>
              <button
                type='button'
                onClick={() =>
                  setPeriod((p) => (p === '오전' ? '오후' : '오전'))
                }
                className={periodBtn}
              >
                {period}
              </button>
              <input
                  className={timeInput}
                  value={timeValue}
                  onChange={handleTimeChange}
                  onBlur={handleTimeBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder='00:00'
                  maxLength={5}
                />
            </div>
          </div>
        )}
      </div>
      <div className={footer}>
        <Button
          variant='fillGray'
          size='tiny'
          // 다크 모드시에 색상이 변하면 안되어서 덮어쓰기
          className={css({
            bg: '#EEEFF1 !important',
            color: '#50555E',
            _hover: { bg: '#E0E2E6' },
          })}
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          variant='fillBlue'
          size='small'
          onClick={() => {
            if (selectedDate) {
              if (timeEnabled) {
                const [hStr, mStr] = timeValue.split(':');
                const rawHour = parseInt(hStr) || 0;
                const h =
                  period === '오후'
                    ? (rawHour % 12) + 12
                    : rawHour % 12;
                const m = parseInt(mStr) || 0;
                const dateWithTime = new Date(selectedDate);
                dateWithTime.setHours(h, m, 0, 0);

                if (maxDate && dateWithTime > maxDate) {
                  showAlert('마감 일시 이후 시간은 설정이 불가능합니다.');
                  setTimeValue('00:00');
                  setPeriod('오전');
                  return;
                }

                onSave(dateWithTime, true);
              } else {
                onSave(selectedDate, false);
              }
            }
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

// ======= 스타일 정의 ========
// 달 넘기는 버튼 공용 스타일
const navigationBtnStyle = {
  minWidth: '0 !important',
  cursor: 'pointer',
  bg: 'transparent !important',
  _hover: {
    bg: 'transparent !important',
  },
} as const;

const modalWrapper = css({
  position: 'absolute',
  // 캘린더 위치 임의로 지정
  top: '2.5rem',
  left: 0,
  zIndex: 'modal',
  bg: 'bg',
  p: '1.5rem 1.25rem',
  borderRadius: '0.75rem',
  width: '21.25rem',
  // 그림자 다크모드시 밝게 나타나도록 추가
  boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.08)',
  _dark: {
    boxShadow:
      '0 0 4px 0 rgba(238, 239, 241, 0.08), 0 1px 4px 0 rgba(238, 239, 241, 0.08)',
  },

  // 캘린더 전체 컨테이너
  '& .react-calendar': {
    fontFamily: 'inherit !important', // 폰트 적용 확실하게
    border: 'none !important', // 기본 테두리 없애기
    bg: 'transparent !important', // 기본 배경 없애기
    width: '100% !important',
  },

  // 상단 네비게이션(월,연도 + 화살표)
  '& .react-calendar__navigation': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '0.75rem !important',

    // 텍스트(월,연도) - 왼쪽 배치
    '& .react-calendar__navigation__label': {
      order: 1,
      textStyle: 'body1.m',
      color: 'gray.900',
      flex: 'none !important',
      marginRight: 'auto !important',
      bg: 'transparent !important',
    },

    // 달 넘기는 버튼_ 이전
    '& .react-calendar__navigation__prev-button': {
      ...navigationBtnStyle,
      order: 2,
      minWidth: '0 !important',
      marginRight: '0.5rem !important',
    },
    // 달 넘기는 버튼_ 다음
    '& .react-calendar__navigation__next-button': {
      ...navigationBtnStyle,
      order: 3,
    },
  },

  // 요일이랑 날짜를 감싸는 컨테이너 (실제 달력 판)
  '& .react-calendar__viewContainer': {
    border: '1px solid',
    borderColor: 'gray.100',
    borderRadius: '0.25rem',
    padding: '0.5rem 0.25rem',
  },

  // 요일 표시 부분(한줄 전체)
  '& .react-calendar__month-view__weekdays': {
    borderBottom: '1px solid',
    borderColor: 'gray.100',
    // 패딩 들어간거 계산해서 나온 값
    marginTop: '0.11rem !important',
    paddingBottom: '0.36rem !important',
  },

  // 요일 하나하나
  '& .react-calendar__month-view__weekdays__weekday': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.40388rem !important ',
    height: '2.40388rem !important',

    '& abbr': {
      textDecoration: 'none',
      textStyle: 'body3.r !important',
      color: 'gray.900',
      cursor: 'default',
    },
  },

  // 날짜 표시 부분 (전체)
  '& .react-calendar__month-view__days': {
    marginTop: '0.25rem !important',
    marginBottom: '0.25rem !important',
  },

  // 날짜 하나하나
  '& .react-calendar__tile': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 14.2857% !important',
    height: '2.625rem !important',
    textStyle: 'body3.r !important',
    color: 'gray.900',
    bg: 'transparent !important',
    padding: '0 !important',

    // 체크시 보이는
    '& abbr': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.40388rem !important ',
      height: '2.40388rem !important',
      borderRadius: '50% !important',
      transition:
        'background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease',
    },

    // 기본 주말 빨강색 없애기
    '&.react-calendar__month-view__days__day--weekend': {
      color: 'gray.900 !important',
    },
  },

  // 선택된 날짜 (진입 시 당일+ 선택 시 )
  '& .react-calendar__tile--active': {
    bg: 'transparent !important',
    '& abbr': {
      bg: 'primary !important',
      color: 'bg !important',
      // 디졸브 느낌 나도록
      animationName: 'fade-in',
      animationDuration: '0.5s',
      animationTimingFunction: 'ease',
    },
  },

  // 이웃한 달 날짜들
  // gray.600 으로 수정
  '& .react-calendar__month-view__days__day--neighboringMonth': {
    color: 'gray.600 !important',

    // 이웃한 달이면 주말도 연하게 (중첩)
    '&.react-calendar__month-view__days__day--weekend': {
      color: 'gray.600 !important',
    },
  },

  // 마감일 이후 날짜 비활성화
  '& .react-calendar__tile:disabled': {
    '&:not(.react-calendar__month-view__days__day--neighboringMonth) abbr': {
      color: 'gray.400 !important',
      opacity: '1 !important', // 브라우저가 흐리게 만드는 것 방지
      // 취소선 추가
      textDecoration: 'line-through !important',
      textDecorationColor: 'gray.400',
      textDecorationThickness: '1px',
    },
    cursor: 'not-allowed !important',
    // 비활성화 이면서 이웃한 달
    '&.react-calendar__month-view__days__day--neighboringMonth abbr': {
      color: 'gray.400 !important',
      textDecoration: 'line-through !important',
    },
  },
});

// 시간 추가 섹션 (토글)
const timeSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  mt: '0.75rem',
});

// 시간 추가 토글 행
const timeToggleRow = flex({
  alignItems: 'center',
  justifyContent: 'space-between',
});

const timeToggleLabel = css({
  textStyle: 'body3.m',
  color: 'gray.900',
});

// 날짜 + 시간 입력 행
const dateTimeRow = flex({
  alignItems: 'center',
  justifyContent: 'space-between',
});

const dateLabel = css({
  textStyle: 'body4.r',
  color: 'gray.600',
});

const timeInputBox = flex({
  alignItems: 'center',
  gap: '0.5rem',
  border: '1px solid',
  borderColor: 'gray.600',
  borderRadius: '0.25rem',
  px: '0.5rem',
  py: '0.25rem',
});

const periodBtn = css({
  textStyle: 'body4.r',
  color: 'gray.600',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  p: '0',
});

const timeInput = css({
  textStyle: 'body4.r',
  color: 'gray.600',
  bg: 'transparent',
  border: 'none',
  outline: 'none',
  textAlign: 'left',
  width: '2.5rem',
  p: '0',
});

// 하단 버튼 레이아웃
const footer = flex({ gap: '1.25rem', mt: '1rem' });
