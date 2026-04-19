import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskPriorities } from '@/services/task';
import type { UpdateTaskPrioritiesRequest } from '@/types/task';

// 과제 우선순위 변경 커스텀 훅
export const useUpdateTaskPriorities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedTasks: UpdateTaskPrioritiesRequest['orderedTasks']) =>
      updateTaskPriorities(orderedTasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
