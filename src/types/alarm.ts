// ============================
// 알림 목록 조회 타입 정의
// ============================
export type AlarmOrder = 'asc' | 'desc';
// 이거는 임시입니다 > 백엔드한테 부탁해야하는 상태
export type AlarmTaskType = 'PERSONAL' | 'TEAM';
export type AlarmType =
  | 'TASK'
  | 'SUBTASK'
  | 'MEMBER'
  | 'NOTIFICATION'
  | 'OTHER';

export interface AlarmListItem {
  alarmId: number;
  alarmType?: AlarmType;
  title: string;
  alarmContent: string;
  isRead: boolean;
  alarmDate: string;
  taskId: number;
  taskType?: AlarmTaskType;
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

// ============================
// 안 읽은 알람 여부 반환 조회 타입 정의
// ============================
export interface GetUnreadAlarmCountResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    count: number;
    hasUnread: boolean;
  };
}

// ============================
// 알림 시간 설정 변경 타입 정의
// ============================
export type AlarmSettingKey = 'deadlineAlarm' | 'taskAlarm';

export interface UpdateAlarmSettingRequest {
  deadlineAlarm?: number;
  taskAlarm?: number;
}

export interface UpdateAlarmSettingResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    user: {
      userId: number;
      deadlineAlarm?: number;
      taskAlarm?: number;
    };
  };
}

// ============================
// 과제 알림 여부 수정 (PATCH /alarm/task/{taskId})
// ============================
export interface UpdateTaskAlarmRequest {
  isAlarm: boolean;
}

export interface UpdateTaskAlarmResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    task: {
      taskId: number;
      isAlarm: boolean;
    };
  };
}

// ============================
// 세부 과제 알림 설정 변경 타입 정의
// ============================
export interface UpdateSubTaskAlarmRequest {
  isAlarm: boolean;
}

export interface UpdateSubTaskAlarmResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    subTaskId: number;
    isAlarm: boolean;
  };
}
