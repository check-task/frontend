// ============================
// 알림 목록 조회 타입 정의
// ============================
export type AlarmOrder = 'asc' | 'desc';

export interface AlarmListItem {
  alarmId: number;
  title: string;
  alarmContent: string;
  isRead: boolean;
  alarmDate: string;
  taskId: number;
  subTaskId: number | null;
}

// 요청시 사용되는 파라미터
export interface GetAlarmListParams {
  cursor?: number;
  limit?: number;
  orderBy?: string;
  order?: AlarmOrder;
}

export interface GetAlarmListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    alarmList: AlarmListItem[];
    meta?: {
      hasNextPage?: boolean;
      cursor?: number;
    };
  };
}
