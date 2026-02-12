import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/services/task';
import type { UpdateTaskRequest } from '@/types/task';

export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTaskRequest) => updateTask(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      queryClient.invalidateQueries({ queryKey: ['taskList'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['completedTaskList'] });
    },
  });
};
