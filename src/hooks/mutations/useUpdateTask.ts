import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/services/task';
import type { UpdateTaskRequest } from '@/types/task';
import {
  getSocket,
  TASK_UPDATE_SEND_EVENT,
  type TaskUpdatePayload,
} from '@/lib/socket';

function toTaskUpdatePayload(
  taskId: number,
  body: UpdateTaskRequest,
): TaskUpdatePayload {
  return {
    taskId,
    title: body.title,
    deadline: body.deadline,
    folderId: body.folderId,
    subTasks: body.subTasks.map((st) => ({
      title: st.title,
      status: st.status,
      endDate: st.endDate,
    })),
    references: body.references,
  };
}

export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTaskRequest) => updateTask(taskId, body),
    onSuccess: (_, body) => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit(TASK_UPDATE_SEND_EVENT, toTaskUpdatePayload(taskId, body));
      }
    },
  });
};
