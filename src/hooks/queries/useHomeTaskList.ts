import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTaskList } from '@/services/task';
import { resolveFolderColor } from '@/lib/folder-color';
import type { FolderColor } from '@/types/folder';
import type { TaskSort } from '@/types/task';

// 홈 화면에서 사용하는 과제 타입
export interface HomeAssignment {
  id: number;
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  dueDate: string;
  deadlineTime?: string; // 시간이 있는 경우 "HH:mm:ss"
  assignmentName: string;
  assignmentType: string;
  progress: number;
}

// 캘린더에서 사용하는 세부과제 타입
export interface HomeSubTask {
  subTaskId: number;
  taskId: number;
  title: string;
  status: string;
  dueDate: string;
  folderColor: FolderColor;
}

// 홈 과제 목록 조회 커스텀 훅
export const useHomeTaskList = (sort?: TaskSort) => {
  return useQuery({
    queryKey: ['taskList', { sort }],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { task: tasks, subTask: subTasks } = await getTaskList(
        sort ? { sort } : undefined,
      );

      // task → HomeAssignment 매핑
      const assignments: HomeAssignment[] = tasks.map((task) => ({
        id: task.taskId,
        folderId: task.folderId ?? 0,
        folderName: task.folderTitle ?? '',
        folderColor: resolveFolderColor(task.foldercolor ?? ''),
        dDay: task.dDay,
        dueDate: task.deadline ? task.deadline.split('T')[0] : '', // 시간 제거 (ISO 8601)
        deadlineTime: task.deadline?.includes('T')
          ? task.deadline.split('T')[1]
          : undefined,
        assignmentName: task.title,
        assignmentType: task.type === 'TEAM' ? '팀' : '개인',
        progress: task.progressRate,
      }));

      // taskId → folderColor 룩업 테이블
      const taskColorMap = new Map(
        tasks.map((t) => [t.taskId, resolveFolderColor(t.foldercolor ?? '')]),
      );

      // subTask → HomeSubTask 매핑 (부모 과제의 색상 상속, 완료된 세부과제 제외)
      const homeSubTasks: HomeSubTask[] = subTasks
        .filter((st) => st.status !== 'COMPLETED')
        .map((st) => ({
          subTaskId: st.subTaskId,
          taskId: st.taskId,
          title: st.title,
          status: st.status,
          dueDate: st.deadline ? st.deadline.split('T')[0] : '',
          folderColor: taskColorMap.get(st.taskId) ?? 'red',
        }));

      return { assignments, subTasks: homeSubTasks };
    },
  });
};
