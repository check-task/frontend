'use client';

import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@/styles/fullcalendar.css';
import { token } from 'styled-system/tokens';
import type { FolderColor } from '@/types/folder';
import { useCalendarStore } from '@/stores/calendar-store';

// FolderColor → Panda CSS 토큰 매핑
const FOLDER_COLOR_MAP: Record<FolderColor, string> = {
  red: token('colors.sub.01.100'),
  yellow: token('colors.sub.02.100'),
  green: token('colors.sub.03.100'),
  purple: token('colors.sub.04.100'),
  black: token('colors.sub.05.100'),
};

// 샘플 이벤트
const sampleEvents = [
  {
    id: '1',
    title: '프로그래밍 1차 과제',
    start: '2026-01-24',
    backgroundColor: FOLDER_COLOR_MAP['red'],
  },
  {
    id: '2',
    title: '세부 TASK 긴 버전입니다',
    start: '2026-01-24',
    backgroundColor: FOLDER_COLOR_MAP['yellow'],
  },
  {
    id: '3',
    title: '세부 TASK명',
    start: '2026-01-24',
    backgroundColor: FOLDER_COLOR_MAP['green'],
  },
];

export const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);

  // 스토어 날짜가 변경되면 캘린더 이동
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      // new Date()는 월이 0부터 시작하므로 -1
      calendarApi.gotoDate(new Date(currentYear, currentMonth - 1, 1));
    }
  }, [currentYear, currentMonth]);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={sampleEvents}
      editable={true}
      droppable={true}
      headerToolbar={false}
      height='100%'
      // 6주 고정
      fixedWeekCount={true}
    />
  );
};
