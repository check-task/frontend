import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import DatePicker from '@/components/DatePicker';
import { useUpdateSubTaskDeadline } from './hooks/useUpdateSubTaskDeadline';
import { useUpdateSubTaskStatus } from './hooks/useUpdateSubTaskStatus';
import { useUpdateSubTaskAlarm } from './hooks/useUpdateSubTaskAlarm';
import { SubTaskStatus } from '@/types/task';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Input } from '@/components/TextField';
import { CheckMark } from '@/components/icons/CheckMark';
import { CloseIcon } from '@/components/icons/CloseIcon';

export interface PersonalTaskItem {
  id: number;
  title: string;
  deadline: string;
  isAlarm: boolean;
  status: SubTaskStatus; // 'PROGRESS' | 'COMPLETED' 상태 추가
}

interface PersonalTaskListProps {
  taskId: number;
  tasks: PersonalTaskItem[];
  maxDate?: string | Date;
}

// Api형태에 맞게 Date형태를 YYYY-MM-DD 문자열로 변환
const formatDate = (date: Date) => date.toLocaleDateString('en-CA');

// Task 목록
export const PersonalTaskList = ({
  taskId,
  tasks,
  maxDate,
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

  // 단일 과제 등록 상태 추가
  const [isAdding, setIsAdding] = useState(false); // 입력 폼 활성화 상태
  const [taskName, setTaskName] = useState(''); // 입력 필드 값

  // 단일 과제 추가 핸들러
  const handleAddTask = () => setIsAdding(true);
  // 단일 과제 추가 취소 핸들러
  const handleCancelTask = () => {
    setIsAdding(false);
    setTaskName('');
  };

  // 달력 날짜 변경 시 호출 핸들러
  const handleDeadlineChange = (subTaskId: number) => (date: Date) => {
    mutateDeadline({ subTaskId, endDate: formatDate(date) });
  };

  // 체크박스 선택 시 호출 핸들러
  const handleStatusChange = (subTaskId: number, isChecked: boolean) => {
    mutateStatus({
      subTaskId,
      status: isChecked ? 'COMPLETE' : 'PROGRESS', // 스웨거 요청에 맞게
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
            const isLongTitle = task.title.length >= 23;
            // 완료 여부를 UI에서 사용하기 위함
            // 리스트 한줄을 기준으로 처리하려 했는데 아이콘 부분이 처리가 안되어서  개별 요소로 보냄
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div key={task.id} className={PersonalTaskItemContainerStyle}>
                {/* 왼쪽: 체크박스 + 제목 */}
                <div
                  className={PersonalTaskItemLeftStyle({
                    align: isLongTitle ? 'top' : 'center',
                  })}
                >
                  <div
                    className={checkboxWrapperStyle({
                      align: isLongTitle ? 'top' : 'center',
                    })}
                  >
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
                </div>

                {/* 오른쪽: 달력 + 시계토글 */}
                <div
                  className={teamTaskItemRightStyle({
                    align: isLongTitle ? 'top' : 'center',
                  })}
                >
                  <div className={rightContentWrapperStyle}>
                    <DatePicker
                      value={task.deadline}
                      onChange={handleDeadlineChange(task.id)}
                      muted={isCompleted}
                      maxDate={maxDate}
                    />
                    {/* 시계 아이콘은 꺼짐으로 시작됨  */}
                    <ClockToggle
                      muted={isCompleted}
                      isOn={alarmStateMap[task.id] ?? task.isAlarm}
                      onToggle={handleAlarmToggle(task.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={TaskAddWrapperStyle}>
        {!isAdding ? (
          // 세부 과제 추가 버튼 상태
          <button className={TaskAddButtonStyle} onClick={handleAddTask}>
            <PlusIcon className={iconStyle} />
            <p className={TaskAddButtonTextStyle}>세부과제 추가</p>
          </button>
        ) : (
          // 입력 폼 상태
          <div className={InputFormContainerStyle}>
            <div className={InputRowStyle}>
              <Input
                size='basic'
                className={css({ flex: 1 })}
                placeholder='TASK명을 입력하세요.'
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                autoFocus
              />
              <DatePicker />
            </div>
            <div className={ButtonGroupStyle}>
              <button className={ButtonStyle({ type: 'save' })}>
                <div>
                  <CheckMark
                    variant='blue'
                    className={css({ width: '0.75rem', height: '0.75rem' })}
                  />
                </div>
                저장
              </button>
              <button
                className={ButtonStyle({ type: 'cancel' })}
                onClick={handleCancelTask}
              >
                <div>
                  <CloseIcon size={20} strokeWidth={1} color='gray.600' />
                </div>
                취소
              </button>
            </div>
          </div>
        )}
      </div>
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
  shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
});

// 각 리스트 사이 간격을 위해 한번 더 감쌈
const PersonalTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem', // 각 리스트 사이 간격
});

// 리스트 비어 있을 때 문구 스타일
const emptyStateStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
});

// 각 리스트를 왼쪽 오른쪽으로 구분
const PersonalTaskItemContainerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
});

// 각 리스트에서 왼쪽 (체크박스+ 과제명)
const PersonalTaskItemLeftStyle = cva({
  base: {
    display: 'flex',
    gap: '0.75rem', // 체크박스랑 task 제목 간격
    flex: 1, // 오른쪽 영역에 마진을 줄거라서 남은 부분 차지
    maxWidth: '27rem', // 줄 바꿈이 되기 직전 너비를 주면 됩니다
  },

  variants: {
    align: {
      center: {
        alignItems: 'center',
      },
      top: {
        alignItems: 'flex-start',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

const taskTextStyle = cva({
  base: {
    textStyle: 'body1.m',
    color: 'gray.900',
    wordBreak: 'break-word', // 상자 크기 넘어가면 자동으로 줄 바꿈
  },
  variants: {
    completed: {
      true: {
        textStyle: 'body1.r',
        color: 'gray.400',
        textDecoration: 'line-through',
        textDecorationThickness: '0.09rem', // 임의로 넣음
      },
      false: { color: 'gray.900' },
    },
  },
  defaultVariants: {
    completed: false,
  },
});

// 체크 박스
const checkboxWrapperStyle = cva({
  base: {
    display: 'flex',
  },

  variants: {
    align: {
      center: {
        marginTop: '-0.1rem',
      },
      top: {
        marginTop: '0.35rem',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

// 각 리스트에서 오른쪽 영역
const teamTaskItemRightStyle = cva({
  base: {
    display: 'flex',
    ml: '0.75rem',
  },

  variants: {
    align: {
      center: {
        alignItems: 'center',
      },
      top: {
        alignItems: 'flex-start',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

// 달력 왼쪽 시계 오른쪽으로 가도록
const rightContentWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.25rem',
  width: '12rem', // 직접 계산
});

//  일단추가
// 세부 과제 추가 영역 전체 wrapper
const TaskAddWrapperStyle = css({
  width: '100%',
  mt: '1.5rem',
});

// '+ 세부과제 추가' 컨테이너
const TaskAddButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  cursor: 'pointer',
  pr: '0.5rem',
});

// 세부 과제 추가 텍스트 스타일
const TaskAddButtonTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
});

// + 아이콘 스타일
const iconStyle = css({
  w: '1.25rem',
  h: '1.25rem',
  color: 'gray.500',
});

// 입력 폼 컨테이너
const InputFormContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem', // 입력창과 버튼 사이 간격
  w: '100%',
});

// 입력창과 날짜가 있는 행
const InputRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
});

// 하단 버튼(저장/취소) 행
const ButtonGroupStyle = css({
  display: 'flex',
  gap: '0.75rem', // 버튼 사이 간격
});

// 저장/취소 공통 버튼 스타일
const ButtonStyle = cva({
  // 공통 스타일
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 1rem 0.5rem 0.7rem',
    borderRadius: '2.5rem',
    textStyle: 'body3.m',
    cursor: 'pointer',
    border: '1px solid',
  },

  variants: {
    type: {
      //  저장버튼 스타일
      save: {
        borderColor: 'blue.500',
        color: 'blue.500',
      },
      cancel: {
        borderColor: 'gray.100',
        color: 'gray.600',
      },
    },
  },
});
