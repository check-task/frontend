import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommunication } from '@/lib/reference';
import { getSocket, COMMUNICATION_SEND_EVENTS } from '@/lib/socket';

/** 커뮤니케이션 수정 (백엔드 communication:update 소켓 또는 REST) */
export const useUpdateCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      communicationId,
      name,
      url,
    }: {
      communicationId: number;
      name: string;
      url: string;
    }) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<unknown>((resolve, reject) => {
          socket.emit(
            COMMUNICATION_SEND_EVENTS.UPDATE,
            { taskId, communicationId, name, url },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve(res);
              else reject(new Error(res?.reason ?? '커뮤니케이션 수정에 실패했습니다.'));
            },
          );
        });
      }
      return updateCommunication(taskId, communicationId, { name, url });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
