import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinTask } from '@/services/task';

// 팀과제 참여 커스텀 훅
interface JoinTaskInput {
  inviteCode: string;
  folderId?: number | null;
}

export const useJoinTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inviteCode, folderId }: JoinTaskInput) =>
      joinTask(inviteCode, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
