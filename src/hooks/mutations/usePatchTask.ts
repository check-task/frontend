import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTask } from '@/services/task';
import type { PatchTaskRequest } from '@/types/task';
import { emitMainTaskUpdated } from './emitMainTaskUpdated';

export const usePatchTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PatchTaskRequest) => patchTask(taskId, body),
    onSuccess: (_, body) => {
      queryClient.invalidateQueries({ queryKey: ['taskList'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      emitMainTaskUpdated(taskId, {
        title: body.title,
        folderId: body.folderId,
        deadline: body.deadline,
      });
    },
  });
};
