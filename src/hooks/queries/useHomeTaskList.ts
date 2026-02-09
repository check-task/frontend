import { useQuery } from '@tanstack/react-query';
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
  assignmentName: string;
  assignmentType: string;
  progress: number;
}

// 홈 과제 목록 조회 커스텀 훅
export const useHomeTaskList = (sort?: TaskSort) => {
  return useQuery({
    queryKey: ['taskList', { sort }],
    queryFn: async (): Promise<HomeAssignment[]> => {
      const tasks = await getTaskList(sort ? { sort } : undefined);

      return tasks.map((task) => ({
        id: task.taskId,
        folderId: task.folderId ?? 0,
        folderName: task.folderTitle ?? '',
        folderColor: resolveFolderColor(task.foldercolor ?? ''),
        dDay: task.dDay,
        dueDate: task.deadline.replace(/\./g, '-'), // FullCalendar와 호환을 위해 . -> -로 변경
        assignmentName: task.title,
        assignmentType: task.type === 'TEAM' ? '팀' : '개인',
        progress: task.progressRate,
      }));
    },
  });
};
