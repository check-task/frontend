import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReferenceData } from '@/lib/reference';

// 자료 삭제 뮤테이션 (성공 시 taskDetail 캐시 무효화)
export const useDeleteReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referenceId: number) => deleteReferenceData(taskId, referenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};

