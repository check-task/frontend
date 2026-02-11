import { useMutation } from '@tanstack/react-query';
import { createInvitationLink } from '@/services/task';

export const useCreateInvitationLink = (taskId: number) => {
  return useMutation({
    mutationFn: () => createInvitationLink(taskId),
  });
};
