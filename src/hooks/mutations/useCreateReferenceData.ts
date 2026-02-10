import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReferenceData } from '@/lib/reference';
import type { ReferenceDataType } from '@/types/api/reference';

// 자료 생성 뮤테이션 (성공 시 taskDetail 캐시 무효화)
export const useCreateReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      type: ReferenceDataType;
      payload: { name?: string; url?: string; file?: File };
    }) => createReferenceData(taskId, params.type, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
