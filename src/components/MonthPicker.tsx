'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { css } from 'styled-system/css';
import { token } from 'styled-system/tokens';
import { DatepickerNextIcon } from '@/components/icons/DatepickerNextIcon';
import { DatepickerPrevIcon } from '@/components/icons/DatepickerPrevIcon';
import { useCalendarStore } from '@/stores/calendar-store';

interface MonthPickerProps {
  onClose?: () => void;
}

export default function MonthPicker({ onClose }: MonthPickerProps) {
  const setDate = useCalendarStore((state) => state.setDate);

  const handleClickMonth = (value: Date) => {
    const year = value.getFullYear();
    const month = value.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    setDate(year, month);
    onClose?.();
  };

  return (
    <div className={modalWrapper}>
      <Calendar
        locale='ko-KR'
        calendarType='gregory'
        maxDetail='year'
        minDetail='year'
        nextLabel={<DatepickerNextIcon size='lg' />}
        prevLabel={<DatepickerPrevIcon size='lg' />}
        next2Label={null}
        prev2Label={null}
        formatMonthYear={(locale, date) => `${date.getFullYear()}년`}
        onClickMonth={handleClickMonth}
      />
    </div>
  );
}

// ======= 스타일 정의 ========
// 년 넘기는 버튼 공용 스타일
const navigationBtnStyle = {
  minWidth: '0 !important',
  cursor: 'pointer',
  bg: 'transparent !important',
  _hover: {
    bg: 'transparent !important',
  },
};

const modalWrapper = css({
  zIndex: 'modal',
  bg: 'bg',
  width: '20rem',
  padding: '1.25rem !important',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)', // 크기가 안보여서 임시로 넣어둠

  // 캘린더 전체 컨테이너
  '& .react-calendar': {
    border: 'none !important', // 기본 테두리 없애기
    bg: 'transparent !important', // 기본 배경 없애기
    width: '100% !important',
  },

  // 상단 네비게이션(년도 + 화살표)
  '& .react-calendar__navigation': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${token('colors.gray.100')}`,
    paddingBottom: '0.75rem !important', // 헤더와 밑줄 사이 간격
    marginBottom: '1rem !important', // 밑줄이랑 컨텐츠 사이 간격

    // 텍스트(년도) - 왼쪽 배치
    '& .react-calendar__navigation__label': {
      order: 1,
      textStyle: 'h4 !important',
      color: 'gray.900 !important',
      flex: 'none !important',
      marginRight: 'auto !important',
      bg: 'transparent !important',
      cursor: 'default !important',
    },

    // 년 넘기는 버튼_ 이전
    '& .react-calendar__navigation__prev-button': {
      ...navigationBtnStyle,
      order: 2,
      marginRight: '0.5rem !important',
    },
    // 년 넘기는 버튼_ 다음
    '& .react-calendar__navigation__next-button': {
      ...navigationBtnStyle,
      order: 3,
    },
  },

  // 월들을 담고 있는 컨테이너
  '& .react-calendar__year-view__months': {
    display: 'grid !important',
    // 한줄에 4개씩
    gridTemplateColumns: 'repeat(4, 1fr)',
    rowGap: '0.75rem',
    columnGap: '0.83rem',
    justifyItems: 'center',
  },

  // 월 하나하나
  '& .react-calendar__year-view .react-calendar__tile': {
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    width: '3.75rem !important',
    height: '3.75rem !important',
    padding: '0 !important', // 기존 패딩 제거
    bg: 'transparent !important',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'all 0.3s ease',

    // 월 글자 스타일
    '& abbr': {
      textStyle: 'body1.r',
      color: 'gray.700',
      textDecoration: 'none !important',
    },

    // 월 글자 호버시
    '&:hover': {
      bg: 'blue.50 !important',
      '& abbr': {
        textStyle: 'body1.m !important',
        color: 'blue.500 !important',
      },
    },
  },
});
