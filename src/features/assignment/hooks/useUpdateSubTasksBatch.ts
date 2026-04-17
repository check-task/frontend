'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTasksBatch } from '@/services/subtask';
import type { UpdateSubTasksBatchItem } from '@/types/task';

export const useUpdateSubTasksBatch = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subTasks: UpdateSubTasksBatchItem[]) =>
      updateSubTasksBatch(taskId, { subTasks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
