import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '@/services/task';

export const useDeleteTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['completedTaskList'] });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
