import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTask } from '@/services/task';
import type { PatchTaskRequest } from '@/types/task';

export const usePatchTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PatchTaskRequest) => patchTask(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
