'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_SET_ASSIGNEE } from '@/lib/socket';
import { updateSubTaskAssignee } from '@/services/subtask';

interface UpdateSubTaskAssigneeInput {
  taskId: number;
  subTaskId: number;
  assigneeId: number;
}

/** 팀 과제 세부 TASK 담당자 설정 (소켓 우선, 미연결 시 REST 폴백) */
export const useUpdateSubTaskAssignee = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId: tid,
      subTaskId,
      assigneeId,
    }: UpdateSubTaskAssigneeInput): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_SET_ASSIGNEE,
            { taskId: tid, subTaskId, assigneeId },
            (res: { success?: boolean; error?: string }) => resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await updateSubTaskAssignee(subTaskId, { assigneeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
