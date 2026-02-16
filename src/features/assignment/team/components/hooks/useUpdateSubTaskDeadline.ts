'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';
import { getSocket, TASK_REQUEST_REFRESH_EVENT } from '@/lib/socket';

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
