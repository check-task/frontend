import {
  CompletedTask,
  CreateTaskRequest,
  CreateTaskResponse,
  GetCompletedTaskListResponse,
  GetTaskDetailResponse,
  GetTaskListParams,
  GetTaskListResponse,
  Task,
  TaskDetail,
  TaskMeetingLog,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// baseURL(NEXT_PUBLIC_API_URL)에 /api/v1 가 포함되어 있다고 가정하고
// 여기서는 순수 path('/task')만 사용합니다.
const TASK_BASE = '/task';

// 과제 목록 조회 api 호출
export const getTaskList = async (
  params?: GetTaskListParams,
): Promise<Task[]> => {
  const res = await axiosInstance.get<GetTaskListResponse>(TASK_BASE, {
    params,
  });
  const data = res.data?.data;
  return Array.isArray(data) ? data : [];
};

// 완료 과제 목록 조회 api 호출
export const getCompletedTaskList = async (): Promise<CompletedTask[]> => {
  const res = await axiosInstance.get<GetCompletedTaskListResponse>(
    `${TASK_BASE}/completed`,
  );
  return res.data?.data?.tasks ?? [];
};

// 과제 상세 조회 api 호출 (communications에 communication_id → communicationId 매핑)
export const getTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const res = await axiosInstance.get<GetTaskDetailResponse>(
    `${TASK_BASE}/${taskId}`,
  );
  const data = res.data.data;
  if (data.communications?.length) {
    data.communications = data.communications.map(
      (c: { communication_id?: number; communicationId?: number; name: string; url: string }) => ({
        ...c,
        communicationId: c.communicationId ?? c.communication_id,
      }),
    );
  }
  if (data.meetingLogs?.length) {
    data.meetingLogs = data.meetingLogs.map(
      (m: TaskMeetingLog & { log_id?: number }) => {
        const dateStr = typeof m.date === 'string' && m.date.includes('T')
          ? m.date.slice(0, 10)
          : m.date;
        return {
          logId: m.logId ?? m.log_id ?? 0,
          date: dateStr,
          agenda: m.agenda,
          conclusion: m.conclusion,
          discussion: m.discussion,
        };
      },
    );
  }
  return data;
};

// 과제 생성 api 호출 (201 응답 시 data.taskId 반환, 응답 형태 다양하게 처리)
export const createTask = async (
  body: CreateTaskRequest,
): Promise<number> => {
  const res = await axiosInstance.post<CreateTaskResponse>(TASK_BASE, body);
  const bodyData = res.data?.data;
  const taskId =
    typeof bodyData === 'object' && bodyData !== null && 'taskId' in bodyData
      ? (bodyData as { taskId: number }).taskId
      : typeof bodyData === 'number'
        ? bodyData
        : undefined;
  if (typeof taskId !== 'number') {
    throw new Error(
      '과제 생성 응답에 taskId가 없습니다. 서버 응답 형식을 확인해주세요.',
    );
  }
  return taskId;
};
