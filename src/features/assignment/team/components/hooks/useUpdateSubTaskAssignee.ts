'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskAssignee } from '@/services/subtask';
import { getSocket, TASK_REQUEST_REFRESH_EVENT } from '@/lib/socket';

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
