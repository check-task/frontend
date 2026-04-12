import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { Input } from '@/components/TextField';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import DatePicker from '@/components/DatePicker';
import { useUpdateSubTaskDeadline } from './hooks/useUpdateSubTaskDeadline';
import { useUpdateSubTaskStatus } from './hooks/useUpdateSubTaskStatus';
import { useUpdateSubTaskAlarm } from './hooks/useUpdateSubTaskAlarm';
import { SubTaskStatus } from '@/types/task';
import { TaskAddForm } from '@/features/assignment/components/TaskAddForm';
import { CloseIcon } from '@/components/icons/CloseIcon';

export interface PersonalTaskItem {
  id: number;
  title: string;
  deadline: string;
  isAlarm: boolean;
  status: SubTaskStatus;
}

interface PersonalTaskListProps {
  taskId: number;
  tasks: PersonalTaskItem[];
  maxDate?: string | Date;
  isEditMode?: boolean;
  editedTitles?: Record<number, string>;
  onTitleChange?: (id: number, title: string) => void;
  onDeleteTask?: (id: number) => void;
}

/** 시간 미설정 시 사용할 기본 시간 */
const DEFAULT_DEADLINE_TIME = 'T23:59:59';

// 시간 설정 여부에 따라 YYYY-MM-DDTHH:mm:ss 반환
const formatDate = (date: Date, withTime: boolean) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (withTime) {
    return `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }
  return `${base}${DEFAULT_DEADLINE_TIME}`;
};

const hasTimeSet = (deadline?: string | Date): boolean => {
  if (typeof deadline !== 'string') return false;
  return deadline.includes('T') && !deadline.endsWith(':59');
};

// Task 목록
export const PersonalTaskList = ({
  taskId,
  tasks,
  maxDate,
  isEditMode = false,
  editedTitles = {},
  onTitleChange,
  onDeleteTask,
}: PersonalTaskListProps) => {
  // 세부 task 마감일 변경 훅 호출
  const { mutate: mutateDeadline } = useUpdateSubTaskDeadline(taskId);
  // 세부 task 완료 상태 변경 훅 호출
  const { mutate: mutateStatus } = useUpdateSubTaskStatus(taskId);
  // 세부 task 알림 설정 변경 훅 호출
  const { mutate: mutateAlarm } = useUpdateSubTaskAlarm(taskId);
  const [alarmStateMap, setAlarmStateMap] = useState<Record<number, boolean>>(
    {},
  );

  // 달력 날짜 변경 시 호출 핸들러
  const handleDeadlineChange = (subTaskId: number) => (date: Date, timeEnabled: boolean) => {
    mutateDeadline({ subTaskId, endDate: formatDate(date, timeEnabled) });
  };

  // 체크박스 선택 시 호출 핸들러
  const handleStatusChange = (subTaskId: number, isChecked: boolean) => {
    mutateStatus({
      subTaskId,
      status: isChecked ? 'COMPLETED' : 'PENDING',
    });
  };

  // 알림 설정 변경 핸들러
  const handleAlarmToggle = (subTaskId: number) => (next: boolean) => {
    setAlarmStateMap((prev) => ({ ...prev, [subTaskId]: next }));
    mutateAlarm({ subTaskId, isAlarm: next });
  };

  return (
    <div className={PersonalTaskListContainerStyle}>
      {tasks.length === 0 ? (
        <div className={emptyStateStyle}>등록된 task가 없습니다.</div>
      ) : (
        <div className={PersonalTaskListStyle}>
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div key={task.id} className={PersonalTaskItemContainerStyle}>
                {/* 왼쪽: [일반] 체크박스 + 제목 / [수정] Input */}
                <div className={PersonalTaskItemLeftStyle}>
                  {isEditMode ? (
                    <Input
                      size='basic'
                      width='100%'
                      value={editedTitles[task.id] ?? task.title}
                      onChange={(e) => onTitleChange?.(task.id, e.target.value)}
                      className={css({ flex: 1 })}
                    />
                  ) : (
                    <>
                      <div className={checkboxWrapperStyle}>
                        <Checkbox
                          checked={isCompleted}
                          variant='black'
                          onChange={(event) =>
                            handleStatusChange(task.id, event.target.checked)
                          }
                        />
                      </div>
                      <p className={taskTextStyle({ completed: isCompleted })}>
                        {task.title}
                      </p>
                    </>
                  )}
                </div>

                {/* 오른쪽: 달력 + 시계토글 (+ 수정모드: 삭제 아이콘) */}
                <div className={css({ display: 'flex', alignItems: 'center', flexShrink: 0, ...(isEditMode && { ml: '1.25rem' }) })}>
                  <div
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: isEditMode ? '0rem' : '1rem',
                      ...(isEditMode && { opacity: 0.4, pointerEvents: 'none' }),
                    })}
                  >
                  <div className={datePickerWrapperStyle}>
                    <DatePicker
                      value={task.deadline}
                      onChange={handleDeadlineChange(task.id)}
                      muted={isCompleted}
                      maxDate={maxDate}
                      initialTimeEnabled={hasTimeSet(task.deadline)}
                    />
                    </div>
                    <ClockToggle
                      muted={isCompleted}
                      isOn={alarmStateMap[task.id] ?? task.isAlarm}
                      onToggle={handleAlarmToggle(task.id)}
                    />
                  </div>
                  {/* 수정 모드에서만 삭제 버튼 렌더 */}
                  {isEditMode && (
                    <button
                      type='button'
                      onClick={() => onDeleteTask?.(task.id)}
                      className={css({
                        cursor: 'pointer',
                        ml: '0.5rem',
                        flexShrink: 0,
                      })}
                    >
                      <CloseIcon size={28} strokeWidth={1} color='gray.900' />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!isEditMode && <TaskAddForm taskId={taskId} maxDate={maxDate} />}
    </div>
  );
};

// ======== 스타일 정의 ========
// 리스트 전체를 감싸는 container
const PersonalTaskListContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '100%',
  p: '1.5rem',
  borderRadius: '0.75rem',
  bg: 'bg',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
  _dark: {
    boxShadow:
      '0 0 4px 0 rgba(238, 239, 241, 0.08), 0 1px 4px 0 rgba(238, 239, 241, 0.08)',
  },
});

// 각 리스트 사이 간격을 위해 한번 더 감쌈
const PersonalTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

// 리스트 비어 있을 때 문구 스타일
const emptyStateStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
});

// 각 리스트를 왼쪽 오른쪽으로 구분
const PersonalTaskItemContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// 각 리스트에서 왼쪽 (체크박스+제목 or Input)
const PersonalTaskItemLeftStyle = css({
  display: 'flex',
  gap: '0.75rem',
  flex: 1,
  alignItems: 'center',
});

const taskTextStyle = cva({
  base: {
    textStyle: 'body1.m',
    color: 'gray.900',
    wordBreak: 'break-word',
    flex: 1,
  },
  variants: {
    completed: {
      true: {
        textStyle: 'body1.r',
        color: 'gray.400',
        textDecoration: 'line-through',
        textDecorationThickness: '1px',
        textDecorationSkipInk: 'none',
      },
      false: { color: 'gray.900' },
    },
  },
  defaultVariants: {
    completed: false,
  },
});

// 체크 박스
const checkboxWrapperStyle = css({
  display: 'flex',
  marginTop: '-0.1rem',
  flexShrink: 1,
});

// 각 리스트에서 오른쪽 영역
const teamTaskItemRightStyle = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 1,
});


const datePickerWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'left',
  w: '7.75rem',
});
