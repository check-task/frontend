import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllAlarms } from '@/services/alarm';

// 전체 알림 삭제 훅
export const useDeleteAllAlarms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllAlarms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
      queryClient.invalidateQueries({ queryKey: ['alarmUnreadCount'] });
    },
  });
};
