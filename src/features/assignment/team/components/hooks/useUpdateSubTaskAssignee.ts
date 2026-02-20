'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_SET_ASSIGNEE } from '@/lib/socket';

interface UpdateSubTaskAssigneeInput {
  taskId: number;
  subTaskId: number;
  assigneeId: number;
}

/** 팀 과제 세부 TASK 담당자 설정 (백엔드 setSubTaskAssignee 소켓) */
export const useUpdateSubTaskAssignee = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      subTaskId,
      assigneeId,
    }: UpdateSubTaskAssigneeInput): Promise<void> =>
      new Promise((resolve, reject) => {
        const socket = getSocket();
        if (!socket?.connected) {
          reject(new Error('소켓이 연결되지 않았습니다.'));
          return;
        }
        socket.emit(
          SOCKET_SET_ASSIGNEE,
          { taskId, subTaskId, assigneeId },
          (res: { success?: boolean; error?: string }) => {
            if (res?.success) resolve();
            else
              reject(new Error(res?.error ?? '담당자 설정에 실패했습니다.'));
          },
        );
      }),
    onSuccess: (_, { taskId: tid }) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', tid] });
    },
  });
};
