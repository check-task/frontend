import { useQuery } from '@tanstack/react-query';
import { getTaskDetail } from '@/services/task';
import { TaskDetail } from '@/types/task';
import { PersonalTaskItem } from '@/features/assignment/personal/components/PersonalTaskList';
import type { ReferenceItem } from '@/features/assignment/personal/components/PersonalRightContainer';

// 화면에서 사용하는 형태로 매핑
export interface PersonalTaskDetailView {
  taskId: number; // 세부 과제 수정을 위해 추가
  title: string;
  deadline: string;
  dDay: string;
  progressRate: number;
  folderColorHex?: string;
  tasks: PersonalTaskItem[];
  items: ReferenceItem[];
}

const mapToPersonalView = (data: TaskDetail): PersonalTaskDetailView => {
  // 자료 모음집 항목에 맞게 매핑
  const items: ReferenceItem[] = [...data.references]
    .sort((a, b) => (a.referenceId ?? 0) - (b.referenceId ?? 0))
    .map((ref, index) => ({
      id: ref.referenceId ?? index + 1,
      type: ref.url != null ? 0 : 1,
      name: ref.name,
      path: ref.url ?? ref.file_url ?? '',
      fileName: ref.url != null ? undefined : (ref.fileName ?? undefined),
    }));

  const tasks: PersonalTaskItem[] = [...data.subTasks]
    .sort((a, b) => a.subTaskId - b.subTaskId)
    .map((task) => ({
      id: task.subTaskId,
      title: task.title,
      deadline: task.deadline,
      isAlarm: task.isAlarm,
      status: task.status,
    }));

  return {
    taskId: data.taskId,
    title: data.title,
    deadline: data.deadline,
    dDay: data.dDay,
    progressRate: data.progressRate,
    folderColorHex: data.foldercolor,
    tasks,
    items,
  };
};

// 개인 과제 상세 조회 훅
export const usePersonalTaskDetail = (taskId: number) => {
  return useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: (): Promise<TaskDetail> => getTaskDetail(taskId),
    // select 옵션으로 화면에 사용되는 형태로 변환
    select: mapToPersonalView,
  });
};
