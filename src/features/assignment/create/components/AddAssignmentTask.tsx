'use client';

import { PlusButton } from '@/components/PlusButton';
import { Input } from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';

export interface SubTaskInput {
  id: number;
  title: string;
  endDate: Date;
}

interface AddAssignmentTaskProps {
  subTasks: SubTaskInput[];
  onSubTasksChange: (subTasks: SubTaskInput[]) => void;
  maxDate?: Date | null;
}

export const AddAssignmentTask = ({
  subTasks,
  onSubTasksChange,
  maxDate,
}: AddAssignmentTaskProps) => {
  const handleAddTask = () => {
    const defaultEndDate = new Date();
    onSubTasksChange([
      ...subTasks,
      {
        id: Date.now(),
        title: '',
        endDate: defaultEndDate,
      },
    ]);
  };

  const handleUpdate = (
    id: number,
    field: 'title' | 'endDate',
    value: string | Date,
  ) => {
    onSubTasksChange(
      subTasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const showTaskInput = subTasks.length > 0;

  return (
    <div className={taskDataItemStyle}>
      <p className={labelTextStyle}>TASK</p>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: showTaskInput ? 1 : 'none',
        })}
      >
        {subTasks.map((task) => (
          <div
            key={task.id}
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            })}
          >
            <Input
              size='basic'
              placeholder='TASK명을 입력하세요.'
              className={css({ flex: 1 })}
              value={task.title}
              onChange={(e) => handleUpdate(task.id, 'title', e.target.value)}
            />
            <DatePicker
              value={task.endDate}
              onChange={(d) => handleUpdate(task.id, 'endDate', d)}
              maxDate={maxDate ?? undefined}
            />
          </div>
        ))}

        <PlusButton
          onClick={handleAddTask}
          className={css({
            alignSelf: showTaskInput ? 'flex-start' : 'auto',
            marginTop: showTaskInput ? '0.25rem' : '0',
          })}
        >
          TASK 추가하기
        </PlusButton>
      </div>
    </div>
  );
};

const labelTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const taskDataItemStyle = css({
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start',
});
