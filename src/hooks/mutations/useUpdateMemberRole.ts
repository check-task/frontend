import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberRole } from '@/services/task';
import { getSocket, SOCKET_UPDATE_MEMBER } from '@/lib/socket';

/** 멤버 역할 변경 (백엔드 member:update 소켓 또는 REST). role: 0=팀장, 1=멤버 */
export const useUpdateMemberRole = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: number;
      role: 0 | 1;
    }) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<void>((resolve, reject) => {
          socket.emit(
            SOCKET_UPDATE_MEMBER,
            { taskId, userId, role },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve();
              else reject(new Error(res?.reason ?? '역할 변경에 실패했습니다.'));
            },
          );
        });
      }
      return updateMemberRole(taskId, userId, role);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
      await queryClient.invalidateQueries({
        queryKey: ['taskMembers', taskId],
        refetchType: 'active',
      });
    },
  });
};
