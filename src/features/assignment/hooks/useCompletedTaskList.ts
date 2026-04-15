import { useQuery } from '@tanstack/react-query';
import { getCompletedTaskList } from '@/services/task';
import { FolderColor } from '@/types/folder';
import { resolveFolderColor } from '@/lib/folder-color';

// 완료 과제 목록 화면에서 사용하는 타입만 정의
export interface CompletedTaskListItem {
  id: number;
  type: 'personal' | 'team';
  folderName: string;
  assignmentName: string;
  dueDate: string;
  folderColor: FolderColor;
}

// 완료 과제 목록 조회 커스텀 훅
export const useCompletedTaskList = () => {
  return useQuery({
    queryKey: ['completedTaskList'],
    queryFn: async (): Promise<CompletedTaskListItem[]> => {
      const tasks = await getCompletedTaskList();

      return tasks.map((task) => ({
        id: task.taskId,
        type: task.type === '팀' ? 'team' : 'personal',
        folderName: task.folderTitle,
        assignmentName: task.title,
        dueDate: task.deadline ? task.deadline.split('T')[0] : '',
        folderColor: resolveFolderColor(task.color ?? ''),
      }));
    },
  });
};
