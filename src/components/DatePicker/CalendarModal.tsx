'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { css } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { DatepickerNextIcon } from '../icons/DatepickerNextIcon';
import { DatepickerPrevIcon } from '../icons/DatepickerPrevIcon';
import { useState } from 'react';
import { Button } from '../Button';

interface CalenderModalProps {
  onClose: () => void;
  onSave: (date: Date) => void;
  // 초기 날짜를 받기 위함
  initialDate: Date;
}

export default function CalendarModal({
  onClose,
  onSave,
  initialDate,
}: CalenderModalProps) {
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

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
        maxDetail='month' // 달 뷰로 고정
        minDetail='month'
        nextLabel={<DatepickerNextIcon />}
        prevLabel={<DatepickerPrevIcon />}
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleString('en', { weekday: 'narrow' })
        }
      />

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
              onSave(selectedDate);
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

  // 캘린더 전체 컨테이너
  '& .react-calendar': {
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
    },
  },

  // 이웃한 달 날짜들
  '& .react-calendar__month-view__days__day--neighboringMonth': {
    color: 'gray.400 !important',

    // 이웃한 달이면 주말도 연하게 (중첩)
    '&.react-calendar__month-view__days__day--weekend': {
      color: 'gray.400 !important',
    },
  },
});

// 하단 버튼 레이아웃
const footer = flex({ gap: '1.25rem', mt: '1.25rem' });
