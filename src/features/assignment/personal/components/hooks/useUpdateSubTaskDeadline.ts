import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';

interface UpdateSubTaskDeadlineInput {
  subTaskId: number;
  endDate: string; // YYYY-MM-DD
}

// 세부 TASK 마감일 변경 훅
export const useUpdateSubTaskDeadline = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, endDate }: UpdateSubTaskDeadlineInput) =>
      // 세부 task 마감일 변경 api 호출
      updateSubTaskDeadline(subTaskId, { endDate }),

    // 성공 시 개인 과제 상세 데이터 무효화 후 다시 조회
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
