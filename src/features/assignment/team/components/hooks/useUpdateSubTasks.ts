'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_UPDATE_SUBTASKS } from '@/lib/socket';
import { updateSubTasksBatch } from '@/services/subtask';

interface SubTaskUpdateItem {
  subTaskId: number;
  title?: string;
  endDate?: string;
  isAlarm?: boolean;
}

interface UpdateSubTasksInput {
  data: SubTaskUpdateItem[];
}

/** 팀 과제 세부 TASK 선택 수정 (소켓 우선, 미연결 시 REST fallback) */
export const useUpdateSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: UpdateSubTasksInput): Promise<void> => {
      const socket = getSocket();
      if (socket?.connected) {
        const socketOk = await new Promise<boolean>((resolve) => {
          socket.emit(
            SOCKET_UPDATE_SUBTASKS,
            { taskId, data },
            (res: { success?: boolean; error?: string }) =>
              resolve(!!res?.success),
          );
        });
        if (socketOk) return;
      }
      await updateSubTasksBatch(taskId, {
        subTasks: data.map((item) => ({
          subTaskId: item.subTaskId,
          title: item.title ?? '',
          deadline: item.endDate ?? '',
          isAlarm: item.isAlarm ?? false,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
