import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSubTasksBulk } from '@/services/subtask';
import { getSocket, SOCKET_DELETE_SUBTASKS } from '@/lib/socket';

// 세부 TASK 선택 삭제 훅 (소켓 우선, 미연결 시 REST 폴백)
export const useDeleteSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subTaskIds: number[]): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_DELETE_SUBTASKS,
            { taskId, subTaskIds },
            (res: { success?: boolean; error?: string }) =>
              resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await deleteSubTasksBulk(taskId, { subTaskIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
