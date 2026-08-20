'use client';

import { useState, useRef, useEffect } from 'react';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Input } from '@/components/TextField';
import { css } from 'styled-system/css';
import DatePicker from '@/components/DatePicker';
import { FormActionButtons } from '@/features/assignment/components/FormActionButtons';
import { useCreateSubTask } from '@/hooks/mutations/useCreateSubTask';
import { useAlertStore } from '@/stores/alert-store';

const DEFAULT_DEADLINE_TIME = 'T23:59:59';

const formatDeadline = (date: Date, withTime: boolean): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (withTime) {
    return `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }
  return `${base}${DEFAULT_DEADLINE_TIME}`;
};

interface AddTaskButtonProps {
  taskId: number;
  maxDate?: string | Date;
}

export const AddTaskButton = ({ taskId, maxDate }: AddTaskButtonProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: createSubTask, isPending } = useCreateSubTask(taskId);
  const showAlert = useAlertStore((state) => state.showAlert);

  useEffect(() => {
    if (isInputVisible) {
      inputRef.current?.focus();
    }
  }, [isInputVisible]);

  const closeAndClear = () => {
    setIsInputVisible(false);
    setValue('');
    setDeadline(null);
    setTimeEnabled(false);
  };

  const handleSave = () => {
    const title = value.trim();
    if (!title) {
      showAlert('세부과제명을 입력하세요.', 'x');
      return;
    }
    createSubTask(
      {
        title,
        deadline: deadline ? formatDeadline(deadline, timeEnabled) : null,
        isAlarm: Boolean(deadline),
      },
      {
        onSuccess: closeAndClear,
        onError: (err: Error) => {
          const ax = err as unknown as {
            response?: { data?: { reason?: string } };
          };
          showAlert(
            ax?.response?.data?.reason ?? '세부과제 추가에 실패했습니다.',
            'x',
          );
        },
      },
    );
  };

  const handleDelete = () => {
    closeAndClear();
  };

  if (isInputVisible) {
    return (
      <div className={inputWrapperStyle}>
        <div className={inputContainerStyle}>
          <Input
            ref={inputRef}
            size='basic'
            width='37.875rem'
            placeholder='세부과제명을 입력하세요.'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <DatePicker
            allowUnspecified
            value={deadline}
            onChange={(d, withTime) => {
              setDeadline(d);
              setTimeEnabled(withTime);
            }}
            maxDate={maxDate}
          />
        </div>

        <div className={buttonGroupStyle}>
          <FormActionButtons
            onSave={handleSave}
            onCancel={handleDelete}
            isPending={isPending}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type='button'
      className={addTaskButtonStyle}
      onClick={() => {
        setDeadline(null);
        setIsInputVisible(true);
      }}
    >
      <PlusIcon />
      <p className={addTaskButtonTextStyle}>세부과제 추가</p>
    </button>
  );
};

const addTaskButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: 'gray.500',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
});

const addTaskButtonTextStyle = css({
  textStyle: 'body3.r',
});

const inputWrapperStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const inputContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

const buttonGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.5rem',
  mr: '3rem',
});
