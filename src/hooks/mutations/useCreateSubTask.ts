import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubTask } from '@/services/task';
import type { CreateSubTaskRequest, TaskDetail } from '@/types/task';
import { getSocket, SOCKET_CREATE_SUBTASK } from '@/lib/socket';

// 낙관적으로 추가하는 임시 세부과제에 부여할 고유 id (실제 서버 id와 겹치지 않도록 음수 사용)
let nextTempSubTaskId = -1;

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
            { taskId, data: body },
            (res: { success?: boolean; reason?: string }) =>
              resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      return createSubTask(taskId, body);
    },
    onMutate: async (body: CreateSubTaskRequest) => {
      await queryClient.cancelQueries({ queryKey: ['taskDetail', taskId] });

      // 롤백 시 다른 낙관적 항목까지 지우지 않도록, 이 mutation이 추가한 임시 id만 기억해둠
      const tempId = nextTempSubTaskId--;

      // 임시 ID로 즉시 캐시에 추가 → 폼 닫힘과 동시에 목록에 노출
      queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
        if (!old) return old;
        return {
          ...old,
          subTasks: [
            ...old.subTasks,
            {
              subTaskId: tempId,
              title: body.title,
              deadline: body.deadline,
              status: 'PROGRESS' as const,
              isAlarm: body.isAlarm,
              commentCount: 0,
              assignees: [],
            },
          ],
        };
      });

      return { tempId };
    },
    onSuccess: () => {
      // 백그라운드에서 서버와 동기화 (임시 ID → 실제 ID)
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
    onError: (_error, _variables, context) => {
      // 생성 실패 시 이 mutation이 추가했던 임시 항목만 제거 (다른 진행 중인 낙관적 항목은 유지)
      if (context?.tempId == null) return;
      queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
        if (!old) return old;
        return {
          ...old,
          subTasks: old.subTasks.filter((t) => t.subTaskId !== context.tempId),
        };
      });
    },
  });
};
