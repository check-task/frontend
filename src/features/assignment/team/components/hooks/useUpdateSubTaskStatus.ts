'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskStatus } from '@/services/subtask';
import type { UpdateSubTaskStatusRequestStatus } from '@/types/task';
import { getSocket, TASK_REQUEST_REFRESH_EVENT } from '@/lib/socket';

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
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit(TASK_REQUEST_REFRESH_EVENT, { taskId });
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log('[Socket] task:request_refresh 전송, taskId:', taskId);
        }
      }
    },
  });
};

