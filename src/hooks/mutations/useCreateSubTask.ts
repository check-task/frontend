import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubTask } from '@/services/task';
import type { CreateSubTaskRequest, TaskDetail } from '@/types/task';
import { getSocket, SOCKET_CREATE_SUBTASK } from '@/lib/socket';

/** 단일 세부과제 생성 (백엔드 subtask:create 소켓 또는 REST) */
export const useCreateSubTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateSubTaskRequest) => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_CREATE_SUBTASK,
            { taskId, ...body },
            (res: { success?: boolean; reason?: string }) => resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      return createSubTask(taskId, body);
    },
    onMutate: (body: CreateSubTaskRequest) => {
      // 임시 ID로 즉시 캐시에 추가 → 폼 닫힘과 동시에 목록에 노출
      queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
        if (!old) return old;
        return {
          ...old,
          subTasks: [
            ...old.subTasks,
            {
              subTaskId: Date.now(),
              title: body.title,
              deadline: body.deadline,
              status: 'PROGRESS' as const,
              isAlarm: body.isAlarm,
              commentCount: 0,
              assigneeName: '',
            },
          ],
        };
      });
    },
    onSuccess: () => {
      // 백그라운드에서 서버와 동기화 (임시 ID → 실제 ID)
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
