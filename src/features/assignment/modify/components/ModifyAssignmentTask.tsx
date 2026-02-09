'use client';

import { useEffect, useRef, useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { Textarea } from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { css } from 'styled-system/css';
import { dummyPersonalTasks } from '@/constants/PersonalTaskMock';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { useModalStore } from '@/stores/modal-store';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';

interface TaskItem {
  id: number;
  title: string;
  dueDate?: string; // 서버에서 strig 형태로 받음
}

// Task 목록 부분 컴포넌트 create->AddAssignmentTask 참고
export const ModifyAssignmentTask = () => {
  // 모달 스토어
  const { openModal, closeModal } = useModalStore();
  // task 더미 데이터로 초기화
  const [tasks, setTasks] = useState<TaskItem[]>(dummyPersonalTasks);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Task에서 텍스트에 따라 높이 자동 조절 처리
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = '0px'; // 초기화 진행 후
    el.style.height = `${el.scrollHeight}px`; // 스크롤 높이로 설정
  };

  // listRef 내부에 있는 모든 textarea를 순회하여 높이 조절
  const resizeAll = () => {
    const root = listRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLTextAreaElement>('textarea').forEach(autoResize);
  };

  useEffect(() => {
    resizeAll();
    const root = listRef.current;
    if (!root) return;

    const ro = new ResizeObserver(resizeAll);
    ro.observe(root); // root의 변화 감지 즉 사이드바에 의한 폭 변화 감지
    return () => ro.disconnect(); // 메모리 누수 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TASK 추가 핸들러
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { id: Date.now(), title: '' }]);
  };

  // TASK명 변경 핸들러
  const handleTitleChange = (id: number, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task)),
    );
  };

  // 마감기한 변경 핸들러
  const handleDateChange = (id: number, date: Date) => {
    // 받은 date를 로컬 YYYY-MM-DD 형태로
    // 기존 toISOString 쓰면 UTC 기준이라서 전날이 나올 수 있어 변경
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const nextDate = `${yyyy}-${mm}-${dd}`;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, dueDate: nextDate } : task,
      ),
    );
  };

  // TASK 삭제 핸들러 -> 모달에서 사용
  const handleRemoveTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // TASK 삭제 모달 열림 핸들러
  const handleOpenDeleteModal = (task: TaskItem) => {
    openModal({
      title: 'TASK 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={task.title || 'TASK'}
          onConfirm={() => {
            handleRemoveTask(task.id);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const showTaskInput = tasks.length > 0;

  return (
    <div className={taskDataItemStyle}>
      <p className={labelTextStyle}>TASK</p>
      <div
        ref={listRef} // 여기에 ref 연결하여 아래 모든 textarea 변화 감지
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: showTaskInput ? 1 : 'none',
        })}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            })}
          >
            <Textarea
              size='basic'
              placeholder='TASK명을 입력하세요.'
              className={css({
                flex: 1,
                overflow: 'hidden',
              })}
              value={task.title}
              onChange={(e) => {
                handleTitleChange(task.id, e.target.value);
                autoResize(e.currentTarget); // 입력된 결과에 따라 즉시 높이 조절
              }}
            />
            <DatePicker
              value={task.dueDate}
              onChange={(date) => handleDateChange(task.id, date)}
            />
            <button
              type='button'
              className={removeButtonStyle}
              onClick={() => handleOpenDeleteModal(task)}
              aria-label='자료 삭제'
            >
              <CloseIcon size='2rem' color='gray.600' />
            </button>
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

const removeButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  _hover: {
    cursor: 'pointer',
  },
});
