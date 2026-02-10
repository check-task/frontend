import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskAlarm } from '@/services/alarm';

interface UpdateSubTaskAlarmInput {
  subTaskId: number;
  isAlarm: boolean;
}

// 세부 TASK 알림 설정 변경 훅
export const useUpdateSubTaskAlarm = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, isAlarm }: UpdateSubTaskAlarmInput) =>
      updateSubTaskAlarm(subTaskId, { isAlarm }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
