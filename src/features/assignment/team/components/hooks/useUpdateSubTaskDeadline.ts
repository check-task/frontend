'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_UPDATE_DEADLINE } from '@/lib/socket';
import { updateSubTaskDeadline } from '@/services/subtask';

interface UpdateSubTaskDeadlineInput {
  taskId: number;
  subTaskId: number;
  endDate: string; // YYYY-MM-DD
}

/** 팀 과제 세부 TASK 마감일 변경 (소켓 우선, 미연결 시 REST 폴백) */
export const useUpdateTeamSubTaskDeadline = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId: tid,
      subTaskId,
      endDate,
    }: UpdateSubTaskDeadlineInput): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_UPDATE_DEADLINE,
            { taskId: tid, subTaskId, endDate },
            (res: { success?: boolean; message?: string; error?: string }) => resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await updateSubTaskDeadline(subTaskId, { endDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
