import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberRole } from '@/services/task';

export const useUpdateMemberRole = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 0 | 1 }) =>
      updateMemberRole(taskId, userId, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['taskMembers', taskId],
        refetchType: 'active',
      });
    },
  });
};
