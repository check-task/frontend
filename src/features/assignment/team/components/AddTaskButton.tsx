'use client';

import { useState, useRef, useEffect } from 'react';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Input } from '@/components/TextField';
import { css } from 'styled-system/css';
import DatePicker from '@/components/DatePicker';
import { SaveIcon } from '@/components/icons/SaveIcon';
import { DeleteTaskIcon } from '@/components/icons/DeleteTaskIcon';
import { useCreateSubTask } from '@/hooks/mutations/useCreateSubTask';

const toYYYYMMDD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

interface AddTaskButtonProps {
  taskId: number;
}

export const AddTaskButton = ({ taskId }: AddTaskButtonProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState<Date>(() => new Date());
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: createSubTask, isPending } = useCreateSubTask(taskId);

  useEffect(() => {
    if (isInputVisible) {
      inputRef.current?.focus();
    }
  }, [isInputVisible]);

  const closeAndClear = () => {
    setIsInputVisible(false);
    setValue('');
    setDeadline(new Date());
    setSaveError(null);
  };

  const handleSave = () => {
    const title = value.trim();
    if (!title) {
      setSaveError('세부과제명을 입력하세요.');
      return;
    }
    setSaveError(null);
    createSubTask(
      {
        title,
        deadline: toYYYYMMDD(deadline),
        isAlarm: false,
      },
      {
        onSuccess: closeAndClear,
        onError: (err: Error) => {
          const ax = err as unknown as { response?: { data?: { reason?: string } } };
          setSaveError(ax?.response?.data?.reason ?? '세부과제 추가에 실패했습니다.');
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
            width='37.125rem'
            placeholder='세부과제명을 입력하세요.'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <DatePicker
            value={deadline}
            onChange={(d) => setDeadline(d)}
          />
        </div>

        <div className={buttonGroupStyle}>
          {saveError && (
            <p className={errorTextStyle}>{saveError}</p>
          )}
          <div className={buttonContainerStyle}>
            <button
              type='button'
              className={buttonSaveStyle}
              onClick={handleSave}
              disabled={isPending}
            >
              <SaveIcon />
              저장
            </button>
            <button
              type='button'
              className={buttonDeleteStyle}
              onClick={handleDelete}
              disabled={isPending}
            >
              <DeleteTaskIcon />
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type='button'
      className={addTaskButtonStyle}
      onClick={() => {
        setSaveError(null);
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
  alignItems: 'flex-start',
  width: '100%',
});

const inputContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

const buttonGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.5rem',
});

const errorTextStyle = css({
  textStyle: 'body3.r',
  color: 'red.500',
});

const buttonContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

const buttonSaveStyle = css({
  display: 'flex',
  width: '4.875rem',
  height: '2.375rem',
  borderRadius: '2.5rem',
  border: '0.0625rem solid',
  borderColor: 'blue.500',
  textStyle: 'body3.m',
  color: 'blue.500',
  cursor: 'pointer',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.25rem',
});

const buttonDeleteStyle = css({
  display: 'flex',
  width: '4.875rem',
  height: '2.375rem',
  borderRadius: '2.5rem',
  border: '0.0625rem solid',
  borderColor: 'gray.600',
  textStyle: 'body3.m',
  color: 'gray.600',
  cursor: 'pointer',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.25rem',
});
