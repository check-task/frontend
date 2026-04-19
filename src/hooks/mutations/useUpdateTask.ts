import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/services/task';
import type { UpdateTaskRequest } from '@/types/task';
import { emitMainTaskUpdated } from './emitMainTaskUpdated';

export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTaskRequest) => updateTask(taskId, body),
    onSuccess: (_, body) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      emitMainTaskUpdated(taskId, {
        title: body.title,
        folderId: body.folderId,
        deadline: body.deadline,
      });
    },
  });
};
