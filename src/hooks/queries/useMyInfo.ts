import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '@/services/user';

// 내 정보 조회 커스텀 훅
export const useMyInfo = () => {
  return useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });
};
