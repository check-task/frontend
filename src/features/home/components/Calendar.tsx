'use client';

import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@/styles/fullcalendar.css';
import { token } from 'styled-system/tokens';
import type { FolderColor } from '@/types/folder';
import { useCalendarStore } from '@/stores/calendar-store';
import { useUpdateTaskDeadline } from '@/hooks/mutations/useUpdateTaskDeadline';

// FolderColor → Panda CSS 토큰 매핑
const FOLDER_COLOR_MAP: Record<FolderColor, string> = {
  red: token('colors.sub.01.100'),
  yellow: token('colors.sub.02.100'),
  green: token('colors.sub.03.100'),
  purple: token('colors.sub.04.100'),
  black: token('colors.sub.05.100'),
};

// 과제 타입
interface Assignment {
  id: number;
  folderId: number;
  folderColor: FolderColor;
  dueDate: string;
  assignmentName: string;
}

interface CalendarProps {
  assignments: Assignment[];
  selectedFolderIds: number[];
}

export const Calendar = ({ assignments, selectedFolderIds }: CalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const updateDeadline = useUpdateTaskDeadline();

  // 드래그 시 즉각적인 UI 반영을 위한 로컬 상태
  const [items, setItems] = useState(assignments);

  useEffect(() => {
    setItems(assignments);
  }, [assignments]);

  // 선택된 폴더의 과제만 필터링하여 캘린더 이벤트로 변환
  const filteredEvents = items
    .filter((assignment) => selectedFolderIds.includes(assignment.folderId))
    .map((assignment) => ({
      id: String(assignment.id), // FullCalendar의 id는 문자열을 요구
      title: assignment.assignmentName,
      start: assignment.dueDate,
      backgroundColor: FOLDER_COLOR_MAP[assignment.folderColor],
    }));

  // 스토어 날짜가 변경되면 캘린더 이동
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      // new Date()는 월이 0부터 시작하므로 -1
      calendarApi.gotoDate(new Date(currentYear, currentMonth - 1, 1));
    }
  }, [currentYear, currentMonth]);

  // 캘린더에서 이벤트 드래그 시 마감일 변경
  const handleEventDrop = (info: EventDropArg) => {
    const taskId = Number(info.event.id);
    const newDate = info.event.startStr;

    // 즉시 로컬 상태 반영
    setItems((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, dueDate: newDate } : item,
      ),
    );

    updateDeadline.mutate(
      { taskId, deadline: newDate },
      { onError: () => info.revert() },
    );
  };

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={filteredEvents}
      editable={true}
      droppable={true}
      eventDrop={handleEventDrop}
      headerToolbar={false}
      height='100%'
      // 6주 고정
      fixedWeekCount={true}
    />
  );
};
