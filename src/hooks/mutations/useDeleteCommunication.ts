import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommunication } from '@/lib/reference';

// 커뮤니케이션 삭제 뮤테이션 (성공 시 taskDetail 무효화)
export const useDeleteCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communicationId: number) =>
      deleteCommunication(taskId, communicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
