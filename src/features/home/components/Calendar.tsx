'use client';

import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventReceiveArg } from '@fullcalendar/interaction';
import '@/styles/fullcalendar.css';
import { css } from 'styled-system/css';
import { stack } from 'styled-system/patterns';
import { token } from 'styled-system/tokens';
import type { FolderColor } from '@/types/folder';
import { useRouter } from 'next/navigation';
import { useCalendarStore } from '@/stores/calendar-store';
import { useUpdateTaskDeadline } from '@/hooks/mutations/useUpdateTaskDeadline';
import { useUpdateSubTaskDeadlineForCalendar } from '@/hooks/mutations/useUpdateSubTaskDeadlineForCalendar';
import {
  UnspecifiedTaskSection,
  type UnspecifiedSubTask,
} from './UnspecifiedTaskSection';

// FolderColor → Panda CSS 토큰 매핑
const FOLDER_COLOR_MAP: Record<FolderColor, string> = {
  red: token('colors.sub.01.100'),
  yellow: token('colors.sub.02.100'),
  green: token('colors.sub.03.100'),
  purple: token('colors.sub.04.100'),
  black: token('colors.sub.05.100'),
  null: token('colors.sub.null.100'),
};

// 과제 타입
interface Assignment {
  id: number;
  folderId: number;
  folderColor: FolderColor;
  dueDate: string;
  deadlineTime?: string;
  assignmentName: string;
  assignmentType: string;
}

// 세부과제 타입
interface SubTask {
  subTaskId: number;
  taskId: number;
  title: string;
  status: string;
  dueDate: string | null;
  deadlineTime?: string;
  folderColor: FolderColor;
}

interface CalendarProps {
  assignments: Assignment[];
  subTasks?: SubTask[];
  selectedFolderIds: number[];
}

export const Calendar = ({
  assignments,
  subTasks = [],
  selectedFolderIds,
}: CalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const currentYear = useCalendarStore((state) => state.currentYear);
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const router = useRouter();
  const updateDeadline = useUpdateTaskDeadline();
  const updateSubTaskDeadline = useUpdateSubTaskDeadlineForCalendar();

  // 드래그 시 즉각적인 UI 반영을 위한 로컬 상태
  const [items, setItems] = useState(assignments);
  const [subItems, setSubItems] = useState(subTasks);

  useEffect(() => {
    setItems(assignments);
  }, [assignments]);

  useEffect(() => {
    setSubItems(subTasks);
  }, [subTasks]);

  // 선택된 폴더의 과제만 필터링하여 캘린더 이벤트로 변환
  const taskEvents = items
    .filter((assignment) => selectedFolderIds.includes(assignment.folderId))
    .map((assignment) => {
      const type = assignment.assignmentType === '팀' ? 'team' : 'personal';
      return {
        id: String(assignment.id), // FullCalendar의 id는 문자열을 요구
        title: assignment.assignmentName,
        start: assignment.dueDate,
        allDay: true,
        url: `/assignment/${type}/${assignment.id}`,
        backgroundColor: FOLDER_COLOR_MAP[assignment.folderColor],
        extendedProps: { deadlineTime: assignment.deadlineTime },
      };
    });

  // 세부과제를 캘린더 이벤트로 변환
  const filteredTaskIds = new Set(taskEvents.map((e) => Number(e.id)));
  const unspecifiedSubTasks: UnspecifiedSubTask[] = subItems
    .filter((st) => filteredTaskIds.has(st.taskId) && st.dueDate === null)
    .map((st) => ({
      subTaskId: st.subTaskId,
      taskId: st.taskId,
      title: st.title,
      folderColor: st.folderColor,
    }));
  const datedSubItems = subItems.filter(
    (st): st is SubTask & { dueDate: string } =>
      filteredTaskIds.has(st.taskId) && st.dueDate !== null,
  );
  const subTaskEvents = datedSubItems.map((st) => {
    const parentTask = items.find((a) => a.id === st.taskId);
    const type = parentTask?.assignmentType === '팀' ? 'team' : 'personal';
    return {
      id: `sub-${st.subTaskId}`,
      title: st.title,
      start: st.dueDate,
      allDay: true,
      url: `/assignment/${type}/${st.taskId}`,
      backgroundColor: 'transparent',
      borderColor: FOLDER_COLOR_MAP[st.folderColor],
      textColor: FOLDER_COLOR_MAP[st.folderColor],
      classNames: ['fc-subtask-event'],
    };
  });

  const filteredEvents = [...taskEvents, ...subTaskEvents];

  const canDropSubTaskOnDate = (subTaskId: number, date: string) => {
    const sub = subItems.find((s) => s.subTaskId === subTaskId);
    if (!sub) return false;

    const parent = items.find((a) => a.id === sub.taskId);
    if (!parent) return false;

    return date <= parent.dueDate;
  };

  // 스토어 날짜가 변경되면 캘린더 이동
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      // new Date()는 월이 0부터 시작하므로 -1
      calendarApi.gotoDate(new Date(currentYear, currentMonth - 1, 1));
    }
  }, [currentYear, currentMonth]);

  // 캘린더 이벤트 클릭 시 과제 상세 페이지로 이동
  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault(); // url 속성으로 인한 전체 페이지 이동 방지
    const eventId = info.event.id;
    let taskId: number;

    if (eventId.startsWith('sub-')) {
      const subTaskId = Number(eventId.replace('sub-', ''));
      const sub = subItems.find((s) => s.subTaskId === subTaskId);
      if (!sub) return;
      taskId = sub.taskId;
    } else {
      taskId = Number(eventId);
    }

    const task = items.find((a) => a.id === taskId);
    if (!task) return;

    const type = task.assignmentType === '팀' ? 'team' : 'personal';
    router.push(`/assignment/${type}/${taskId}`);
  };

  // 드롭 허용 여부 검증
  // - 과제: 세부과제 마감일 중 가장 늦은 날짜보다 이전으로 이동 불가
  // - 세부과제: 상위 과제 마감일 이후로 이동 불가
  const handleEventAllow = (
    dropInfo: { startStr: string },
    draggedEvent: { id: string } | null,
  ) => {
    if (!draggedEvent) return false;
    const eventId = draggedEvent.id;
    if (!eventId.startsWith('sub-')) {
      // 과제 이동: 세부과제가 없으면 자유롭게 이동 가능
      const taskId = Number(eventId);
      const childSubs = subItems.filter((s) => s.taskId === taskId);
      if (childSubs.length === 0) return true;
      // 세부과제 중 가장 늦은 마감일 이전으로는 이동 불가
      const childDueDates = childSubs
        .map((s) => s.dueDate)
        .filter((dueDate): dueDate is string => dueDate !== null)
        .sort();
      const latestSubDate = childDueDates.at(-1);
      if (!latestSubDate) return true;

      return dropInfo.startStr >= latestSubDate;
    }

    // 세부과제 이동: 상위 과제 마감일 이후로는 이동 불가
    const subTaskId = Number(eventId.replace('sub-', ''));
    return canDropSubTaskOnDate(subTaskId, dropInfo.startStr);
  };

  // 날짜 미지정 세부과제를 캘린더로 드롭하면 마감일 지정
  const handleEventReceive = (info: EventReceiveArg) => {
    const subTaskId = Number(info.event.extendedProps.subTaskId);
    const newDate = info.event.startStr;

    if (!subTaskId || !newDate || !canDropSubTaskOnDate(subTaskId, newDate)) {
      info.revert();
      return;
    }

    info.event.remove();

    const endDate = `${newDate}T23:59:59`;
    setSubItems((prev) =>
      prev.map((item) =>
        item.subTaskId === subTaskId
          ? { ...item, dueDate: newDate, deadlineTime: '23:59:59' }
          : item,
      ),
    );
    updateSubTaskDeadline.mutate(
      { subTaskId, endDate },
      {
        onError: () => {
          setSubItems((prev) =>
            prev.map((item) =>
              item.subTaskId === subTaskId
                ? { ...item, dueDate: null, deadlineTime: undefined }
                : item,
            ),
          );
        },
      },
    );
  };

  // 캘린더에서 이벤트 드래그 시 마감일 변경 (과제 / 세부과제 구분)
  const handleEventDrop = (info: EventDropArg) => {
    const eventId = info.event.id;
    const newDate = info.event.startStr;

    if (eventId.startsWith('sub-')) {
      // 세부과제 마감일 변경
      const subTaskId = Number(eventId.replace('sub-', ''));
      const subTask = subItems.find((item) => item.subTaskId === subTaskId);
      const deadlineTime = subTask?.deadlineTime ?? '23:59:59';
      const endDate = `${newDate}T${deadlineTime}`;
      setSubItems((prev) =>
        prev.map((item) =>
          item.subTaskId === subTaskId ? { ...item, dueDate: newDate } : item,
        ),
      );
      updateSubTaskDeadline.mutate(
        { subTaskId, endDate },
        { onError: () => info.revert() },
      );
    } else {
      // 과제 마감일 변경 (기존 시간 보존)
      const taskId = Number(eventId);
      const deadlineTime = info.event.extendedProps.deadlineTime as
        | string
        | undefined;
      const deadline = deadlineTime ? `${newDate}T${deadlineTime}` : newDate;
      setItems((prev) =>
        prev.map((item) =>
          item.id === taskId ? { ...item, dueDate: newDate } : item,
        ),
      );
      updateDeadline.mutate(
        { taskId, deadline },
        { onError: () => info.revert() },
      );
    }
  };

  return (
    <div className={calendarContentStyle}>
      <UnspecifiedTaskSection tasks={unspecifiedSubTasks} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={filteredEvents}
        editable={true}
        droppable={true}
        dropAccept='.unspecified-task-draggable'
        eventAllow={handleEventAllow}
        eventReceive={handleEventReceive}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        headerToolbar={false}
        height='auto'
        displayEventTime={false}
        // 6주 고정
        fixedWeekCount={true}
      />
    </div>
  );
};

const calendarContentStyle = css(
  stack.raw({
    gap: '1rem',
  }),
);
