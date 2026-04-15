import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/services/task';
import type { UpdateTaskRequest } from '@/types/task';
import { getSocket, TASK_UPDATE_SEND_EVENT } from '@/lib/socket';

export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateTaskRequest): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            TASK_UPDATE_SEND_EVENT,
            { taskId, body },
            (res: { success?: boolean; error?: string }) => resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await updateTask(taskId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
