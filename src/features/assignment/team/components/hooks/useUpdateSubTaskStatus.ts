'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateSubTaskStatusRequestStatus } from '@/types/task';
import { getSocket, SOCKET_UPDATE_SUBTASK } from '@/lib/socket';

interface UpdateSubTaskStatusInput {
  taskId: number;
  subTaskId: number;
  status: UpdateSubTaskStatusRequestStatus;
}

/** 팀 과제 세부 TASK 완료 상태 변경 (백엔드 updateSubtaskStatus 소켓) */
export const useUpdateTeamSubTaskStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      subTaskId,
      status,
    }: UpdateSubTaskStatusInput): Promise<void> =>
      new Promise((resolve, reject) => {
        const socket = getSocket();
        if (!socket?.connected) {
          reject(new Error('소켓이 연결되지 않았습니다.'));
          return;
        }
        socket.emit(
          SOCKET_UPDATE_SUBTASK,
          { taskId, subTaskId, status: status.toUpperCase() },
          (res: { success?: boolean; error?: string }) => {
            if (res?.success) resolve();
            else reject(new Error(res?.error ?? '상태 업데이트에 실패했습니다.'));
          },
        );
      }),
    onSuccess: (_, { taskId: tid }) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', tid] });
    },
  });
};
