'use client';

import { useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { Input } from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';

export const AddAssignmentTask = () => {
  const [taskInputs, setTaskInputs] = useState<number[]>([]);

  const handleAddTask = () => {
    setTaskInputs((prev) => [...prev, Date.now()]);
  };

  const showTaskInput = taskInputs.length > 0;

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
        {taskInputs.map((id) => (
          <div
            key={id}
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
            />
            <DatePicker />
          </div>
        ))}

        <PlusButton
          onClick={handleAddTask}
          className={css({
            alignSelf: showTaskInput ? 'flex-start' : 'auto',
            marginTop: showTaskInput ? '1.25rem' : '0',
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
