import axiosInstance from '@/lib/axiosInstance';
import type {
  AlarmListItem,
  GetAlarmListParams,
  GetAlarmListResponse,
} from '@/types/alarm';

// 알림 목록 조회 api 호출
export const getAlarmList = async (
  params: GetAlarmListParams = {},
): Promise<{ alarmList: AlarmListItem[]; nextCursor?: number }> => {
  const limit = params.limit ?? 10;
  // api 호출
  const res = await axiosInstance.get<GetAlarmListResponse>('/alarm', {
    params: {
      ...params,
      limit,
    },
  });

  const alarmList = res.data.data.alarmList;
  const meta = res.data.data.meta;
  const hasNextPage = meta?.hasNextPage ?? false;
  const nextCursor = hasNextPage ? meta?.cursor : undefined;

  // 데이터랑 다음 페이지 정보 함께 반환
  return { alarmList, nextCursor };
};
