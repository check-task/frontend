'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskStatus } from '@/services/subtask';
import type { UpdateSubTaskStatusRequestStatus } from '@/types/task';

interface UpdateSubTaskStatusInput {
  subTaskId: number;
  status: UpdateSubTaskStatusRequestStatus;
}

// 팀 과제 세부 TASK 완료 상태 변경 훅 (personal과 동일 로직)
export const useUpdateTeamSubTaskStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, status }: UpdateSubTaskStatusInput) =>
      updateSubTaskStatus(subTaskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};

