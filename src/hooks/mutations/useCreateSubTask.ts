import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubTask } from '@/services/task';
import type { CreateSubTaskRequest } from '@/types/task';
import { getSocket, SOCKET_CREATE_SUBTASK } from '@/lib/socket';

/** 단일 세부과제 생성 (백엔드 subtask:create 소켓 또는 REST) */
export const useCreateSubTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateSubTaskRequest) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<unknown>((resolve, reject) => {
          socket.emit(
            SOCKET_CREATE_SUBTASK,
            { taskId, ...body },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve(res);
              else reject(new Error(res?.reason ?? '세부과제 생성에 실패했습니다.'));
            },
          );
        });
      }
      return createSubTask(taskId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
