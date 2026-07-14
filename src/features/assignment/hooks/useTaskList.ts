import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTaskList } from '@/services/task';
import { getFolderTasks } from '@/services/folder';
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

const parseDDay = (dueDate: string): number => {
  if (dueDate.toUpperCase() === 'D-DAY') return 0;
  const match = dueDate.match(/D-(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

// 과제 목록 조회 커스텀 훅
// folderId가 주어지면 해당 폴더들의 진행중 과제만 조회 (null이면 전체 조회)
export const useTaskList = (folderId: number[] | null = null) => {
  return useQuery({
    queryKey: ['taskList', folderId],
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<TaskListItem[]> => {
      if (folderId && folderId.length > 0) {
        const groups = await getFolderTasks(folderId);

        // 폴더별 과제 목록 조회(진행중)
        return groups
          .flatMap(({ folderInfo, tasks }) =>
            tasks.map((task) => ({
              id: task.id,
              type: task.type === 'TEAM' ? ('team' as const) : ('personal' as const),
              folderName: folderInfo.folderTitle,
              assignmentName: task.title,
              dueDate: task.dDay,
              folderColor: resolveFolderColor(folderInfo.color),
            })),
          )
          .filter((item) => !item.dueDate.includes('+'))
          // 폴더별 그룹을 dDay 기준으로 직접 정렬
          .sort((a, b) => parseDDay(a.dueDate) - parseDDay(b.dueDate));
      }

      const { task: tasks } = await getTaskList();

      // 전체 과제 목록 조회(진행중)
      return tasks
        .filter((task) => !task.dDay.includes('+'))
        .map((task) => ({
          id: task.taskId,
          type: task.type === 'TEAM' ? ('team' as const) : ('personal' as const),
          folderName: task.folderTitle ?? '',
          assignmentName: task.title,
          dueDate: task.dDay,
          folderColor: resolveFolderColor(task.foldercolor ?? ''),
        }))
        .sort((a, b) => parseDDay(a.dueDate) - parseDDay(b.dueDate));
    },
  });
};
