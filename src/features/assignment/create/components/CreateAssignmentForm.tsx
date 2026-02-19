'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { CheckboxHeader } from './CheckboxHeader';
import { AddAssignmentContent } from './AddAssignmentContent';
import { AddAssignmentTask, type SubTaskInput } from './AddAssignmentTask';
import { AddAssignmentData, type DataItem } from './AddAssignmentData';
import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { useCreateTask } from '@/hooks/mutations/useCreateTask';
import type { TaskType } from '@/types/task';

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

export const CreateAssignmentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get('taskId');
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { data: myInfo } = useMyInfo();
  const { mutateAsync: createTask, isPending } = useCreateTask();

  const [assignmentName, setAssignmentName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isTeamProject, setIsTeamProject] = useState(false);
  const [subTasks, setSubTasks] = useState<SubTaskInput[]>([]);
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const folders = myInfo?.folders ?? [];
  const isFormValid =
    assignmentName.trim() !== '' &&
    selectedFolderId != null &&
    deadline != null;

  const handleCancel = () => {
    router.push('/assignment');
  };

  const handleSave = async () => {
    if (!isFormValid || deadline == null || selectedFolderId == null) return;

    const folderId = selectedFolderId;
    const type: TaskType = isTeamProject ? 'TEAM' : 'PERSONAL';
    const payload = {
      title: assignmentName.trim(),
      folderId,
      deadline: formatDate(deadline),
      type,
      subTasks: subTasks
        .filter((t) => t.title.trim() !== '')
        .map((t) => ({
          title: t.title.trim(),
          endDate: formatDate(t.endDate),
        })),
      references: dataItems
        .filter((r) => r.type === 0)
        .map((r) => ({ name: r.name, url: r.path })),
    };

    setSaveError(null);
    try {
      const taskId = await createTask(payload);
      const typePath = type === 'TEAM' ? 'team' : 'personal';
      router.push(`/assignment/${typePath}/${taskId}`);
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { reason?: string; message?: string } };
        message?: string;
      };
      const message =
        ax.response?.data?.reason ??
        ax.response?.data?.message ??
        (typeof ax.message === 'string' ? ax.message : null) ??
        '과제 생성에 실패했습니다.';
      setSaveError(message);
    }
  };

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      <div className={headerStyle}>
        <h1 className={css({ textStyle: 'h3', color: 'gray.900' })}>
          과제 등록
        </h1>
        <CheckboxHeader
          isTeamProject={isTeamProject}
          onTeamProjectChange={setIsTeamProject}
        />
      </div>

      <Divider mt='1.75rem' mb='1.75rem' />

      <AddAssignmentContent
        onNameChange={setAssignmentName}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
        onDateChange={(d) => setDeadline(d)}
      />

      <Divider mt='1.75rem' mb='1.75rem' />
      <div className={taskDataWrapperStyle}>
        <AddAssignmentTask
          subTasks={subTasks}
          onSubTasksChange={setSubTasks}
          maxDate={deadline}
        />
        <AddAssignmentData
          dataItems={dataItems}
          onDataItemsChange={setDataItems}
          taskId={taskIdParam ? Number(taskIdParam) : undefined}
        />
      </div>

      {saveError && (
        <p
          className={css({
            textStyle: 'body3.r',
            color: 'red.500',
            mb: '0.5rem',
          })}
        >
          {saveError}
        </p>
      )}
      <div className={buttonWrapperStyle}>
        <Button variant='fillGray' size='xlarge' onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant='fillBlue'
          size='xlarge'
          disabled={!isFormValid || isPending}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    mt: '2.5rem',
    minHeight: 'calc(100vh - 5.25rem - 2.5rem)',
    pb: '14.5rem',
    transition: 'width 0.3s ease',
  },
  variants: {
    collapsed: {
      // 사이드바 접힘
      true: { w: '49.625rem' },
      // 사이드바 열림
      false: { w: '36.875rem' },
    },
  },
});

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: 'full',
  gap: '1.25rem',
});

const taskDataWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const buttonWrapperStyle = css({
  display: 'flex',
  gap: '1.25rem',
  mt: '6.125rem',
  w: 'full',
});
