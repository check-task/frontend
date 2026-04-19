import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunication } from '@/lib/reference';
import { getSocket, COMMUNICATION_SEND_EVENTS } from '@/lib/socket';

/** 커뮤니케이션 생성 (백엔드 communication:create 소켓 또는 REST) */
export const useCreateCommunication = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { name: string; url: string }) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<Awaited<ReturnType<typeof createCommunication>>>((resolve, reject) => {
          socket.emit(
            COMMUNICATION_SEND_EVENTS.CREATE,
            { taskId, name: body.name, url: body.url },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve([]);
              else reject(new Error(res?.reason ?? '커뮤니케이션 생성에 실패했습니다.'));
            },
          );
        });
      }
      return createCommunication(taskId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
