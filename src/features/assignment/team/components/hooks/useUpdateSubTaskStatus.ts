'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateSubTaskStatusRequestStatus } from '@/types/task';
import { getSocket, SOCKET_UPDATE_SUBTASK } from '@/lib/socket';
import { updateSubTaskStatus } from '@/services/subtask';

interface UpdateSubTaskStatusInput {
  taskId: number;
  subTaskId: number;
  status: UpdateSubTaskStatusRequestStatus;
}

/** 팀 과제 세부 TASK 완료 상태 변경 (소켓 우선, 미연결 시 REST 폴백) */
export const useUpdateTeamSubTaskStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId: tid,
      subTaskId,
      status,
    }: UpdateSubTaskStatusInput): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_UPDATE_SUBTASK,
            { taskId: tid, subTaskId, status: status.toUpperCase() },
            (res: { success?: boolean; error?: string }) => resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await updateSubTaskStatus(subTaskId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
