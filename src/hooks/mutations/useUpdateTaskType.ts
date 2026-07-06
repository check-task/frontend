import { updateTaskType } from '@/services/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 개인 -> 팀과제 변경 뮤테이션
export const useUpdateTaskType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => updateTaskType(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
