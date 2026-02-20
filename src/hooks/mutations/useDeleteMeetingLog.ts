import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMeetingLog } from '@/lib/meeting-log';
import { getSocket, LOG_SEND_EVENTS } from '@/lib/socket';

/** 회의록 삭제 (백엔드 log:delete 소켓 또는 REST) */
export const useDeleteMeetingLog = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: number) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<void>((resolve, reject) => {
          socket.emit(
            LOG_SEND_EVENTS.DELETE,
            { taskId, logId },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve();
              else reject(new Error(res?.reason ?? '회의록 삭제에 실패했습니다.'));
            },
          );
        });
      }
      await deleteMeetingLog(taskId, logId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
