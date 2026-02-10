import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskDeadline } from '@/services/task';

// 과제 마감일 변경 커스텀 훅
export const useUpdateTaskDeadline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, deadline }: { taskId: number; deadline: string }) =>
      updateTaskDeadline(taskId, deadline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
