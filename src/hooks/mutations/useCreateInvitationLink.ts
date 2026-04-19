import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvitationLink } from '@/services/task';

export const useCreateInvitationLink = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createInvitationLink(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
