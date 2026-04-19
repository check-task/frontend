import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReferenceData } from '@/lib/reference';
import { getSocket, REFERENCE_SEND_EVENTS } from '@/lib/socket';

/** 자료 삭제 (백엔드 reference:delete 소켓 또는 REST) */
export const useDeleteReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referenceId: number) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<void>((resolve, reject) => {
          socket.emit(
            REFERENCE_SEND_EVENTS.DELETE,
            { taskId, referenceId },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve();
              else reject(new Error(res?.reason ?? '자료 삭제에 실패했습니다.'));
            },
          );
        });
      }
      await deleteReferenceData(taskId, referenceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
