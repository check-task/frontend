import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunication } from '@/lib/reference';

// 커뮤니케이션 생성 뮤테이션 (성공 시 taskDetail 무효화)
export const useCreateCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; url: string }) =>
      createCommunication(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};

