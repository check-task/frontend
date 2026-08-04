import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';

// 캘린더에서 세부과제 드래그 시 마감일 변경 훅 (taskList 무효화)
export const useUpdateSubTaskDeadlineForCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subTaskId,
      endDate,
    }: {
      subTaskId: number;
      endDate: string | null;
    }) => updateSubTaskDeadline(subTaskId, { endDate }),
    onMutate: async ({ subTaskId, endDate }) => {
      await queryClient.cancelQueries({ queryKey: ['taskList'] });
      // 모든 sort 변형의 캐시를 즉시 업데이트
      queryClient.setQueriesData<{
        assignments: unknown[];
        subTasks: { subTaskId: number; dueDate: string | null }[];
      }>({ queryKey: ['taskList'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          subTasks: old.subTasks.map((st) =>
            st.subTaskId === subTaskId ? { ...st, dueDate: endDate } : st,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
