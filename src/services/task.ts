import {
  CompletedTask,
  GetCompletedTaskListResponse,
  GetTaskListParams,
  GetTaskListResponse,
  Task,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// 과제 목록 조회 api 호출
export const getTaskList = async (
  params?: GetTaskListParams,
): Promise<Task[]> => {
  const res = await axiosInstance.get<GetTaskListResponse>('/task', {
    params,
  });

  return res.data.data;
};

// 완료 과제 목록 조회 api 호출
export const getCompletedTaskList = async (): Promise<CompletedTask[]> => {
  const res =
    await axiosInstance.get<GetCompletedTaskListResponse>('/task/completed');

  return res.data.data.tasks;
};
