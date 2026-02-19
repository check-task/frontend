import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expelTaskMember } from '@/services/task';

export const useExpelTaskMember = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => expelTaskMember(taskId, memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['taskMembers', taskId],
        refetchType: 'active',
      });
    },
  });
};
