import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSubTasksBulk } from '@/services/subtask';

// 세부 TASK 선택 삭제 훅 (저장 시 호출)
export const useDeleteSubTasks = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subTaskIds: number[]) =>
      deleteSubTasksBulk(taskId, { subTaskIds }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
