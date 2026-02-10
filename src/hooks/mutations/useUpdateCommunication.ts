import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommunication } from '@/lib/reference';

// 커뮤니케이션 수정 뮤테이션 (성공 시 taskDetail 무효화)
export const useUpdateCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communicationId,
      name,
      url,
    }: {
      communicationId: number;
      name: string;
      url: string;
    }) => updateCommunication(taskId, communicationId, { name, url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
