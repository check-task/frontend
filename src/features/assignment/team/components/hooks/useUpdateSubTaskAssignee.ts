'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskAssignee } from '@/services/subtask';

interface UpdateSubTaskAssigneeInput {
  subTaskId: number;
  assigneeId: number;
}

// 팀 과제 세부 TASK 담당자 설정 훅
export const useUpdateSubTaskAssignee = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, assigneeId }: UpdateSubTaskAssigneeInput) =>
      updateSubTaskAssignee(subTaskId, { assigneeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
