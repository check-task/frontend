import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberRole } from '@/services/task';

export const useUpdateMemberRole = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: number;
      role: 0 | 1;
    }) => updateMemberRole(taskId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskMembers', taskId] });
    },
  });
};
