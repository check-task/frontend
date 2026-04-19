import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { getAlarmList } from '@/services/alarm';
import type { AlarmListItem, GetAlarmListParams } from '@/types/alarm';

type AlarmListQuery = Omit<GetAlarmListParams, 'cursor'>;

// 한 페이지 구조
interface AlarmListPage {
  alarmList: AlarmListItem[];
  nextCursor?: number;
}

// 알림 목록 조회 무한 스크롤 훅 (커서 기반)
export const useInfiniteAlarmList = (params: AlarmListQuery = {}) => {
  return useInfiniteQuery<
    AlarmListPage,
    Error,
    InfiniteData<AlarmListPage>,
    [string, AlarmListQuery],
    number | undefined
  >({
    queryKey: ['alarmList', params],
    queryFn: ({ pageParam }) =>
      getAlarmList({
        ...params,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    // 마지막 페이지의 nextCursor를 다음 페이지의 커서로 사용
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
