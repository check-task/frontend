import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllSubTasks } from '@/services/subtask';

// 특정 TASK의 세부 TASK 전체 삭제 훅
export const useDeleteAllSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllSubTasks(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
