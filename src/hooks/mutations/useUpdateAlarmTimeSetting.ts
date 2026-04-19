import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateDeadlineAlarmSetting,
  updateTaskAlarmSetting,
} from '@/services/alarm';

export const useUpdateDeadlineAlarmSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hours: number) => updateDeadlineAlarmSetting(hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};

export const useUpdateTaskAlarmSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hours: number) => updateTaskAlarmSetting(hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};
