import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskDeadline } from '@/services/task';

// 과제 마감일 변경 커스텀 훅
export const useUpdateTaskDeadline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, deadline }: { taskId: number; deadline: string }) =>
      updateTaskDeadline(taskId, deadline),
    onMutate: async ({ taskId, deadline }) => {
      await queryClient.cancelQueries({ queryKey: ['taskList'] });
      // 날짜 부분만 캐시에 업데이트 (시간 제거, ISO 8601)
      const dueDateOnly = deadline.split('T')[0];
      queryClient.setQueriesData<{
        assignments: { id: number; dueDate: string }[];
        subTasks: unknown[];
      }>({ queryKey: ['taskList'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          assignments: old.assignments.map((a) =>
            a.id === taskId ? { ...a, dueDate: dueDateOnly } : a,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
