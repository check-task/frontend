import { useQuery } from '@tanstack/react-query';
import { getTaskList } from '@/services/task';
import { FOLDER_COLORS, FolderColor } from '@/types/folder';

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

// ==============================
// 임의로 폴더 색상 매핑을 위함
// 백엔드에서 폴더 색상 내려주면 수정할 부분
// ==============================
const resolveFolderColor = (folderId?: number): FolderColor => {
  if (typeof folderId !== 'number') {
    return 'red';
  }

  return FOLDER_COLORS[folderId - 2] ?? 'red';
};

// 과제 목록 조회 커스텀 훅
export const useTaskList = () => {
  return useQuery({
    queryKey: ['taskList'],
    queryFn: async (): Promise<TaskListItem[]> => {
      // 과제 목록 전체 조회 api 호출
      const tasks = await getTaskList();

      // 과제 목록 페이지에 필요한 데이터만 매핑
      return tasks
        .filter((task) => !task.dDay.includes('+'))
        .map((task) => ({
          id: task.taskId,
          type: task.type === 'TEAM' ? 'team' : 'personal',
          folderName: task.folderTitle ?? '',
          assignmentName: task.title,
          dueDate: task.dDay,
          // ==============================
          // 폴더 색상 수정해야함 지금은 관련 없는 값임
          // ==============================
          folderColor: resolveFolderColor(task.folderId),
        }));
    },
  });
};
