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
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// baseURL에 /api/v1 포함 여부에 따라 경로만 사용 (user: /user/me, folder: /user/folder 와 동일 패턴)
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

// 과제 상세 조회 api 호출
export const getTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const res = await axiosInstance.get<GetTaskDetailResponse>(
    `${TASK_BASE}/${taskId}`,
  );
  return res.data.data;
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
