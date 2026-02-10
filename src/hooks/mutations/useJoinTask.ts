import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinTask } from '@/services/task';

// 팀과제 참여 커스텀 훅
export const useJoinTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteCode: string) => joinTask(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
