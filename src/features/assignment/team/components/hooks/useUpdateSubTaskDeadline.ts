'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';

interface UpdateSubTaskDeadlineInput {
  subTaskId: number;
  endDate: string; // YYYY-MM-DD
}

// 팀 과제 세부 TASK 마감일 변경 훅
export const useUpdateTeamSubTaskDeadline = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, endDate }: UpdateSubTaskDeadlineInput) =>
      updateSubTaskDeadline(subTaskId, { endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
