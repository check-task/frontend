import { useQuery } from '@tanstack/react-query';
import { getTaskDetail } from '@/services/task';
import { TaskDetail } from '@/types/task';
import { PersonalTaskItem } from '@/features/assignment/personal/components/PersonalTaskList';
import type { ReferenceItem } from '@/features/assignment/personal/components/PersonalRightContainer';

// 화면에서 사용하는 형태로 매핑
export interface PersonalTaskDetailView {
  taskId: number; // 세부 과제 수정을 위해 추가
  title: string;
  dDay: string;
  progressRate: number;
  tasks: PersonalTaskItem[];
  items: ReferenceItem[];
}

const mapToPersonalView = (data: TaskDetail): PersonalTaskDetailView => {
  // 자료 모음집 항목에 맞게 매핑
  const items: ReferenceItem[] = data.references.map((ref, index) => ({
    id: index + 1,
    type: 0,
    name: ref.name,
    path: ref.url,
  }));

  // Task목록에 사용되는 데이터 형태에 맞게 매핑
  const tasks: PersonalTaskItem[] = data.subTasks.map((task) => ({
    id: task.subTaskId,
    title: task.title,
    deadline: task.deadline,
    isAlarm: task.isAlarm,
    status: task.status,
  }));

  return {
    taskId: data.taskId,
    title: data.title,
    dDay: data.dDay,
    progressRate: data.progressRate,
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
