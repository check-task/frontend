'use client';

import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Input } from '@/components/TextField';
import { CheckMark } from '@/components/icons/CheckMark';
import { CloseIcon } from '@/components/icons/CloseIcon';
import DatePicker from '@/components/DatePicker';

interface TaskAddFormProps {
  maxDate?: string | Date;
}

export const TaskAddForm = ({ maxDate }: TaskAddFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState('');

  const handleAddTask = () => setIsAdding(true);
  const handleCancelTask = () => {
    setIsAdding(false);
    setTaskName('');
  };

  return (
    <div className={taskAddWrapperStyle}>
      {!isAdding ? (
        <button className={taskAddButtonStyle} onClick={handleAddTask}>
          <PlusIcon className={iconStyle} />
          <p className={taskAddButtonTextStyle}>세부과제 추가</p>
        </button>
      ) : (
        <div className={inputFormContainerStyle}>
          <div className={inputRowStyle}>
            <Input
              size='basic'
              className={css({ flex: 1 })}
              placeholder='TASK명을 입력하세요.'
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              autoFocus
            />
            <DatePicker maxDate={maxDate} />
          </div>
          <div className={buttonGroupStyle}>
            <button className={buttonStyle({ type: 'save' })}>
              <div>
                <CheckMark
                  variant='blue'
                  className={css({ width: '0.75rem', height: '0.75rem' })}
                />
              </div>
              저장
            </button>
            <button
              className={buttonStyle({ type: 'cancel' })}
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
  pr: '0.5rem',
});

const taskAddButtonTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
});

const iconStyle = css({
  w: '1.25rem',
  h: '1.25rem',
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
  gap: '1rem',
});

const buttonGroupStyle = css({
  display: 'flex',
  gap: '0.75rem',
});

const buttonStyle = cva({
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
