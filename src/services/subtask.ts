import {
  UpdateSubTaskDeadlineRequest,
  UpdateSubTaskDeadlineResponse,
  UpdateSubTaskStatusRequest,
  UpdateSubTaskStatusResponse,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// 세부 TASK 마감일 변경 api 호출
export const updateSubTaskDeadline = async (
  subTaskId: number,
  body: UpdateSubTaskDeadlineRequest,
): Promise<UpdateSubTaskDeadlineResponse> => {
  const res = await axiosInstance.patch<UpdateSubTaskDeadlineResponse>(
    `/task/subtask/${subTaskId}/deadline`,
    body,
  );

  return res.data;
};

// 세부 TASK 완료 상태 변경 api 호출
export const updateSubTaskStatus = async (
  subTaskId: number,
  body: UpdateSubTaskStatusRequest,
): Promise<UpdateSubTaskStatusResponse> => {
  const res = await axiosInstance.patch<UpdateSubTaskStatusResponse>(
    `/task/subtask/${subTaskId}/status`,
    body,
  );

  return res.data;
};
