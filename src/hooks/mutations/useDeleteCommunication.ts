import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommunication } from '@/lib/reference';
import { getSocket, COMMUNICATION_SEND_EVENTS } from '@/lib/socket';

/** 커뮤니케이션 삭제 (백엔드 communication:delete 소켓 또는 REST) */
export const useDeleteCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communicationId: number) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<void>((resolve, reject) => {
          socket.emit(
            COMMUNICATION_SEND_EVENTS.DELETE,
            { taskId, communicationId },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve();
              else reject(new Error(res?.reason ?? '커뮤니케이션 삭제에 실패했습니다.'));
            },
          );
        });
      }
      await deleteCommunication(taskId, communicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
