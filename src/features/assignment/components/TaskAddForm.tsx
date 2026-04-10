'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Input } from '@/components/TextField';
import { FormActionButtons } from '@/features/assignment/components/FormActionButtons';
import DatePicker from '@/components/DatePicker';
import { useCreateSubTask } from '@/hooks/mutations/useCreateSubTask';

interface TaskAddFormProps {
  taskId: number;
  maxDate?: string | Date;
}

// Api형태에 맞게 Date형태를 YYYY-MM-DDTHH:mm:ss 문자열로 변환
const formatDeadline = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const todayAtMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const TaskAddForm = ({ taskId, maxDate }: TaskAddFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState('');

  // 선택된 날짜 상태 추가
  const [selectedDate, setSelectedDate] = useState<Date>(todayAtMidnight());
  // 세부과제 생성 훅 호출
  const { mutate: createSubTask, isPending } = useCreateSubTask(taskId);

  const handleAddTask = () => setIsAdding(true);
  const handleCancelTask = () => {
    setIsAdding(false);
    setTaskName('');
    setSelectedDate(todayAtMidnight());
  };

  const handleSaveTask = () => {
    const title = taskName.trim();
    if (!title) return;

    // 즉시 폼 닫기 + onMutate 낙관적 업데이트로 task 동시 노출 → 깜빡임 방지
    const deadline = formatDeadline(selectedDate);
    setIsAdding(false);
    setTaskName('');
    setSelectedDate(todayAtMidnight());

    createSubTask({ title, deadline, isAlarm: true });
  };

  return (
    <div className={taskAddWrapperStyle}>
      {!isAdding ? (
        <button className={taskAddButtonStyle} onClick={handleAddTask}>
          <PlusIcon size='1.25rem' color='gray.500' />
          <p className={taskAddButtonTextStyle}>세부과제 추가</p>
        </button>
      ) : (
        <div className={inputFormContainerStyle}>
          <div className={inputRowStyle}>
            <div className={css({ flex: '1' })}>
              <Input
                size='basic'
                className={css({ w: '100%' })}
                placeholder='TASK명을 입력하세요.'
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={datePickerWrapperStyle}>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                maxDate={maxDate}
              />
            </div>
          </div>
          <FormActionButtons
            onSave={handleSaveTask}
            onCancel={handleCancelTask}
            isPending={isPending}
          />
        </div>
      )}
    </div>
  );
};

const taskAddWrapperStyle = css({
  width: '100%',
  mt: '1.5rem',
});

const taskAddButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  cursor: 'pointer',
});

const taskAddButtonTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
});

const inputFormContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  w: '100%',
});

const inputRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const datePickerWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'left',
  w: '10.75rem',
  ml:'2rem',
});


