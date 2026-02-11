import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubTask } from '@/services/task';
import type { CreateSubTaskRequest } from '@/types/task';

export const useCreateSubTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateSubTaskRequest) => createSubTask(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
