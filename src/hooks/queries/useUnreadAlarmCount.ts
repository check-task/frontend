import { useQuery } from '@tanstack/react-query';
import { getUnreadAlarmCount } from '@/services/alarm';

// 안읽은 알림 여부 조회 훅
export const useUnreadAlarmCount = () => {
  return useQuery({
    queryKey: ['alarmUnreadCount'],
    queryFn: getUnreadAlarmCount,
    // 최신 상태 유지를 위해
    // 추후 소켓으로 처리
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
};
