'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_UPDATE_DEADLINE } from '@/lib/socket';

interface UpdateSubTaskDeadlineInput {
  taskId: number;
  subTaskId: number;
  endDate: string; // YYYY-MM-DD
}

/** 팀 과제 세부 TASK 마감일 변경 (백엔드 updateDeadline 소켓) */
export const useUpdateTeamSubTaskDeadline = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      subTaskId,
      endDate,
    }: UpdateSubTaskDeadlineInput): Promise<void> =>
      new Promise((resolve, reject) => {
        const socket = getSocket();
        if (!socket?.connected) {
          reject(new Error('소켓이 연결되지 않았습니다.'));
          return;
        }
        socket.emit(
          SOCKET_UPDATE_DEADLINE,
          { taskId, subTaskId, endDate },
          (res: { success?: boolean; message?: string; error?: string }) => {
            if (res?.success) resolve();
            else
              reject(
                new Error(res?.error ?? res?.message ?? '마감일 업데이트에 실패했습니다.'),
              );
          },
        );
      }),
    onSuccess: (_, { taskId: tid }) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', tid] });
    },
  });
};
