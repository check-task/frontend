'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocket, SOCKET_UPDATE_SUBTASKS } from '@/lib/socket';

interface SubTaskUpdateItem {
  subTaskId: number;
  title?: string;
  endDate?: string;
  isAlarm?: boolean;
}

interface UpdateSubTasksInput {
  data: SubTaskUpdateItem[];
}

/** 팀 과제 세부 TASK 선택 수정 (소켓 우선, 미연결 시 저장 불가) */
export const useUpdateSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: UpdateSubTasksInput): Promise<void> => {
      const socket = getSocket();
      if (!socket?.connected) {
        throw new Error(
          '소켓에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.',
        );
      }
      const socketOk = await new Promise<boolean>((resolve) => {
        socket.emit(
          SOCKET_UPDATE_SUBTASKS,
          { taskId, data },
          (res: { success?: boolean; error?: string }) =>
            resolve(!!res?.success),
        );
      });
      if (!socketOk) {
        throw new Error('세부 과제 수정에 실패했습니다.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
