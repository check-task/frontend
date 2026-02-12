import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskAlarm } from '@/services/alarm';

// 과제 알림 여부 수정 (PATCH /alarm/task/{taskId})
export const useUpdateTaskAlarm = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAlarm: boolean) => updateTaskAlarm(taskId, { isAlarm }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
