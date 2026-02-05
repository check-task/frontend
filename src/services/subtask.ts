import {
  UpdateSubTaskDeadlineRequest,
  UpdateSubTaskDeadlineResponse,
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
