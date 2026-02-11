import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';

// 캘린더에서 세부과제 드래그 시 마감일 변경 훅 (taskList 무효화)
export const useUpdateSubTaskDeadlineForCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, endDate }: { subTaskId: number; endDate: string }) =>
      updateSubTaskDeadline(subTaskId, { endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
