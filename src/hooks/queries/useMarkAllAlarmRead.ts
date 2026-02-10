import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllAlarmRead } from '@/services/alarm';

// 모든 알림 읽음 처리 훅
export const useMarkAllAlarmRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAlarmRead,
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['alarmUnreadCount'] });
    },
  });
};
