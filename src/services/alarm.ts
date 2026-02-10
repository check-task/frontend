import axiosInstance from '@/lib/axiosInstance';
import type {
  AlarmListItem,
  GetAlarmListParams,
  GetAlarmListResponse,
  GetUnreadAlarmCountResponse,
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

// 안읽은 알림 여부 조회 api 호출
export const getUnreadAlarmCount = async (): Promise<{
  count: number;
  hasUnread: boolean;
}> => {
  const res = await axiosInstance.get<GetUnreadAlarmCountResponse>(
    '/alarm/unread-count',
  );

  const data = res.data.data;
  return {
    count: data.count ?? 0,
    hasUnread: data.hasUnread ?? false,
  };
};

// 모든 알림 읽음 처리 api 호출
export const markAllAlarmRead = async (): Promise<void> => {
  await axiosInstance.patch('/alarm');
};

// 개별 알림 삭제 api 호출
export const deleteAlarm = async (alarmId: number): Promise<void> => {
  await axiosInstance.delete(`/alarm/${alarmId}`);
};

// 전체 알림 삭제 api 호출
export const deleteAllAlarms = async (): Promise<void> => {
  await axiosInstance.delete('/alarm');
};
