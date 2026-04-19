import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFolder } from '@/services/folder';
import type { UpdateFolderRequest } from '@/types/api/folder';

interface UpdateFolderInput {
  folderId: number;
  body: UpdateFolderRequest;
}

// 폴더 수정 커스텀 훅
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, body }: UpdateFolderInput) =>
      updateFolder(folderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
