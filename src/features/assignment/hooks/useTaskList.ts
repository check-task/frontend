import { useQuery } from '@tanstack/react-query';
import { getTaskList } from '@/services/task';
import { resolveFolderColor } from '@/lib/folder-color';
import type { FolderColor } from '@/types/folder';

// 과제 목록 화면에서 사용하는 타입만 정의
// assignmentCard에서 사용하는 타입 형태로 매핑
export interface TaskListItem {
  id: number;
  type: 'personal' | 'team';
  folderName: string;
  assignmentName: string;
  dueDate: string;
  folderColor: FolderColor;
  // dateType은 assignmentList에서 전달
}

// 과제 목록 조회 커스텀 훅
export const useTaskList = () => {
  return useQuery({
    queryKey: ['taskList'],
    queryFn: async (): Promise<TaskListItem[]> => {
      const { task: tasks } = await getTaskList();

      // 과제 목록 페이지에 필요한 데이터만 매핑
      return tasks
        .filter((task) => !task.dDay.includes('+'))
        .map((task) => ({
          id: task.taskId,
          type: task.type === 'TEAM' ? 'team' : 'personal',
          folderName: task.folderTitle ?? '',
          assignmentName: task.title,
          dueDate: task.dDay,
          folderColor: resolveFolderColor(task.foldercolor ?? ''),
        }));
    },
  });
};
