import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolder } from '@/services/folder';
import type { CreateFolderRequest } from '@/types/api/folder';

// 폴더 생성 커스텀 훅
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateFolderRequest) => createFolder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};
