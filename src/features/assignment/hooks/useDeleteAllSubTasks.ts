import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllSubTasks } from '@/services/subtask';
import { getSocket, SOCKET_DELETE_ALL_SUBTASKS } from '@/lib/socket';

// 특정 TASK의 세부 TASK 전체 삭제 훅 (소켓 우선, 미연결 시 REST 폴백)
export const useDeleteAllSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_DELETE_ALL_SUBTASKS,
            { taskId },
            (res: { success?: boolean; error?: string }) =>
              resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await deleteAllSubTasks(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
