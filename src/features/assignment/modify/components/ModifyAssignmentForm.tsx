'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { CheckboxHeader } from '../../create/components/CheckboxHeader'; // create있는거 그대로 사용
import { ModifyAssignmentContent } from './ModifyAssignmentContent';
import {
  ModifyAssignmentTask,
  type ModifyTaskItem,
} from './ModifyAssignmentTask';
import {
  ModifyAssignmentData,
  type ModifyDataItem,
} from './ModifyAssignmentData';
import { css, cva } from 'styled-system/css';
import { useUIStore } from '@/stores/ui-store';
import { useModalStore } from '@/stores/modal-store';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTeamTaskDetail } from '@/features/assignment/team/components/hooks/useTeamTaskDetail';
import { resolveFolderColor } from '@/lib/folder-color';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { useUpdateTask } from '@/hooks/mutations/useUpdateTask';
import { useDeleteTask } from '@/hooks/mutations/useDeleteTask';
import type { TaskStatus, TaskType, UpdateTaskRequest } from '@/types/task';

const getFolderIdFromColor = (
  folderColor: string | undefined,
  folders: { id: number; color: string }[],
): number | null => {
  if (!folderColor) return null;
  const normalized = folderColor.startsWith('#')
    ? resolveFolderColor(folderColor)
    : folderColor;
  if (!normalized) return null;
  return folders.find((folder) => folder.color === normalized)?.id ?? null;
};

// 과제 수정 전체 컴포넌트
export const ModifyAssignmentForm = () => {
  // 사이드바 상태 가져오기
  const router = useRouter();
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const { openModal, closeModal } = useModalStore();
  const searchParams = useSearchParams();
  const taskId = Number(searchParams?.get('taskId'));
  const { data } = useTeamTaskDetail(taskId);
  const { data: myInfo } = useMyInfo();
  const folders = myInfo?.folders ?? [];
  const initializedTaskIdRef = useRef<number | null>(null);
  const updateTaskId = Number.isFinite(taskId) ? taskId : 0;
  const { mutateAsync: updateTask, isPending } = useUpdateTask(updateTaskId);
  const { mutateAsync: deleteTask } = useDeleteTask(updateTaskId);

  // 과제 수정 페이지이므로 기본값 세팅
  const [assignmentName, setAssignmentName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<ModifyTaskItem[]>([]);
  const [dataItems, setDataItems] = useState<ModifyDataItem[]>([]);
  const [isTeamProject, setIsTeamProject] = useState(false);

  useEffect(() => {
    if (!data?.taskId || initializedTaskIdRef.current === data.taskId) return;
    if (data.folderId == null && folders.length === 0) return;
    const resolvedFolderId =
      data.folderId ?? getFolderIdFromColor(data.foldercolor, folders);
    setAssignmentName(data.title ?? '');
    setSelectedFolderId(resolvedFolderId);
    setDueDate(data.deadline ? new Date(`${data.deadline}T00:00:00`) : null);
    setIsTeamProject(data.type === 'TEAM');
    initializedTaskIdRef.current = data.taskId;
  }, [data, folders]);

  const initialTasks = data?.subTasks?.map((task) => ({
    id: task.subTaskId,
    title: task.title,
    dueDate: task.deadline,
    status: task.status,
    isAlarm: task.isAlarm,
    assigneeId: task.assigneeId ?? 0,
  }));

  const initialDataItems = data?.references?.map((ref, index) => ({
    id: ref.referenceId ?? index + 1,
    type: (ref.file_url ? 1 : 0) as 0 | 1,
    name: ref.name,
    path: ref.url ?? ref.file_url ?? '',
  }));

  const isFormValid = assignmentName.trim() !== '' && selectedFolderId != null;

  const toYYYYMMDD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const ensureStatus = (status?: TaskStatus): TaskStatus =>
    status === 'COMPLETED' ? 'COMPLETED' : 'PROGRESS';

  const handleCancel = () => {
    if (!Number.isFinite(taskId) || taskId <= 0) {
      router.push('/assignment');
      return;
    }

    const isTeam = data?.type ? data.type === 'TEAM' : isTeamProject;
    const detailType = isTeam ? 'team' : 'personal';
    router.push(`/assignment/${detailType}/${taskId}`);
  };

  const handleSave = async () => {
    if (!isFormValid || dueDate == null || selectedFolderId == null) return;

    const activeTasks = tasks.length > 0 ? tasks : (initialTasks ?? []);
    const type: TaskType = isTeamProject ? 'TEAM' : 'PERSONAL';

    // 타입과 폴더 일치 검증
    const selectedFolder = folders.find((f) => f.id === selectedFolderId);
    const isTeamFolder = selectedFolder?.name === '팀';

    if (
      (type === 'TEAM' && !isTeamFolder) ||
      (type === 'PERSONAL' && isTeamFolder)
    ) {
      alert(
        type === 'TEAM'
          ? '팀 과제는 팀 폴더에만 저장할 수 있습니다.'
          : '개인 과제는 개인 폴더에만 저장할 수 있습니다.',
      );
      return;
    }

    const mergeReferences = (
      items: Array<{ name: string; url: string }>,
    ): Array<{ name: string; url: string }> => {
      const merged = new Map<string, { name: string; url: string }>();
      items.forEach((item) => {
        const key = `${item.name.trim()}|${item.url.trim()}`;
        merged.set(key, { name: item.name.trim(), url: item.url.trim() });
      });
      return Array.from(merged.values()).filter((item) => item.url !== '');
    };

    const localUrlRefs = dataItems
      .filter((item) => item.type === 0)
      .map((item) => ({ name: item.name, url: item.path }));

    const existingFileRefs = dataItems
      .filter((item) => item.type === 1 && item.id > 0)
      .map((item) => ({ name: item.name, url: item.path }));

    const references = mergeReferences([...existingFileRefs, ...localUrlRefs]);

    const newFileItems = dataItems.filter(
      (item) => item.type === 1 && item.id < 0 && item.file,
    );

    // 개인 과제의 경우 assigneeId는 현재 사용자로 설정
    const currentUserId = myInfo?.user?.id ?? 0;

    const subTasksData = activeTasks
      .filter((task) => task.title.trim() !== '')
      .map((task) => ({
        title: task.title.trim(),
        endDate: task.dueDate ?? '',
        status: ensureStatus(task.status),
        isAlarm: task.isAlarm ?? false,
        assigneeId:
          type === 'PERSONAL' ? currentUserId : (task.assigneeId ?? 0),
      }));

    const payload: UpdateTaskRequest = {
      title: assignmentName.trim(),
      deadline: toYYYYMMDD(dueDate),
      type,
      status: ensureStatus(data?.status),
      folderId: selectedFolderId,
      subTasks: subTasksData,
      references,
      fileNames: newFileItems.map((item) => item.name),
      files: newFileItems
        .map((item) => item.file)
        .filter((file): file is File => Boolean(file)),
    };

    try {
      await updateTask(payload);
      const detailType = type === 'TEAM' ? 'team' : 'personal';
      router.push(`/assignment/${detailType}/${taskId}`);
    } catch (error: unknown) {
      console.error('[과제 수정 실패]', error);
      const ax = error as {
        response?: { data?: { reason?: string; message?: string } };
        message?: string;
      };
      const message =
        ax.response?.data?.reason ??
        ax.response?.data?.message ??
        (typeof ax.message === 'string' ? ax.message : null) ??
        '과제 수정에 실패했습니다.';
      alert(message);
    }
  };

  // 과제 삭제 모달 핸들러
  const handleOpenDeleteAssignmentModal = () => {
    openModal({
      title: '과제 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={assignmentName || '과제'}
          onConfirm={async () => {
            if (updateTaskId > 0) {
              await deleteTask();
            }
            closeModal();
            router.push('/assignment');
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <div className={containerStyle({ collapsed: isSidebarCollapsed })}>
      {/* 제목, 체크박스 */}
      <div className={headerStyle}>
        <h1 className={css({ textStyle: 'h3', color: 'gray.900' })}>
          과제 수정
        </h1>
        {/* create->component에 있는걸로 사용 */}
        <CheckboxHeader
          isTeamProject={isTeamProject}
          onTeamProjectChange={setIsTeamProject}
        />
      </div>

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* 과제명, 폴더색, 마감일 */}
      {/* 과제 수정에서는 기본 입력값을 불러오기 위해 이름, 색상, 마감일 전달 */}
      <ModifyAssignmentContent
        name={assignmentName}
        folders={folders}
        selectedFolderId={selectedFolderId}
        date={dueDate}
        onNameChange={setAssignmentName}
        onFolderChange={setSelectedFolderId}
        onDateChange={setDueDate}
      />

      <Divider mt='1.75rem' mb='1.75rem' />

      {/* TASK, 자료 */}
      <div className={taskDataWrapperStyle}>
        {/* TASK 추가 */}
        <ModifyAssignmentTask
          taskId={data?.taskId ?? taskId}
          initialTasks={initialTasks}
          onTasksChange={setTasks}
          maxDate={dueDate}
        />
        {/* 자료 추가 */}
        <ModifyAssignmentData
          taskId={data?.taskId ?? taskId}
          initialItems={initialDataItems}
          onItemsChange={setDataItems}
        />
      </div>

      {/* 과제 삭제 버튼 추가 및 모달 연결 */}
      <button
        type='button'
        className={deleteAssignmentButtonStyle}
        onClick={handleOpenDeleteAssignmentModal}
      >
        과제 삭제
      </button>

      {/* 취소, 저장 */}
      <div className={buttonWrapperStyle}>
        <Button
          variant='fillGray'
          size={isSidebarCollapsed ? 'xlarge' : 'medium'}
          className={buttonSizeTransitionStyle}
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button
          variant='fillBlue'
          size={isSidebarCollapsed ? 'xlarge' : 'medium'}
          className={buttonSizeTransitionStyle}
          disabled={!isFormValid || isPending}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
// 컨테이너에서 사이드바 여부에 따라 너비 조절
const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    mt: '2.5rem',
    minHeight: 'calc(100vh - 5.25rem - 2.5rem)',
    pb: '14.5rem',
    transition: 'max-width 0.3s ease',
  },
  variants: {
    collapsed: {
      // 닫힘
      true: { w: '49.625rem' },
      // 열림
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

const deleteAssignmentButtonStyle = css({
  textStyle: 'body2.m',
  color: 'primary',
  textDecoration: 'underline',
  textUnderlineOffset: '0.3rem', // 임의로 지정
  width: 'fit-content',
  mt: '3.75rem',
  _hover: { cursor: 'pointer' },
});

const buttonWrapperStyle = css({
  display: 'flex',
  gap: '1.25rem',
  mt: '3.75rem',
});

const buttonSizeTransitionStyle = css({
  transition: 'width 0.3s ease, padding 0.3s ease',
});
