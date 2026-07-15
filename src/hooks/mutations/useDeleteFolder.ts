import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFolder } from '@/services/folder';

interface DeleteFolderVariables {
  folderId: number;
  moveTasks?: boolean;
}

// 폴더 삭제 커스텀 훅
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, moveTasks }: DeleteFolderVariables) =>
      deleteFolder(folderId, moveTasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
