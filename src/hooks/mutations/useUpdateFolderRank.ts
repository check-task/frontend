import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFolderPriority } from '@/services/folder';
import type { FolderRankRequest } from '@/types/folder';

// 폴더 순서 변경 커스텀 훅
export const useUpdateFolderRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedFolders: FolderRankRequest['orderedFolders']) =>
      updateFolderPriority({ orderedFolders }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};
