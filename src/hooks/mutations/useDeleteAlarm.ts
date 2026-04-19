import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAlarm } from '@/services/alarm';

// 개별 알림 삭제 훅
export const useDeleteAlarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alarmId: number) => deleteAlarm(alarmId),
    onSuccess: () => {
      // 알림 삭제로 영향 받는 목록과 안 읽은 개수 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
      queryClient.invalidateQueries({ queryKey: ['alarmUnreadCount'] });
    },
  });
};
