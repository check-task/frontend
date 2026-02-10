import axiosInstance from '@/lib/axiosInstance';
import type {
  CreateMeetingLogRequest,
  CreateMeetingLogResponse,
  UpdateMeetingLogRequest,
  UpdateMeetingLogResponse,
  MeetingLogItemResponse,
} from '@/types/task';

// 회의록 생성 API (POST → 해당 과제 전체 회의록 목록 반환)
export async function createMeetingLog(
  taskId: number,
  payload: CreateMeetingLogRequest,
): Promise<MeetingLogItemResponse[]> {
  const res = await axiosInstance.post<CreateMeetingLogResponse>(
    `/reference/log/${taskId}`,
    payload,
  );
  return res.data.data;
}

// 회의록 수정 API (PATCH → 수정된 회의록 한 건 반환)
export async function updateMeetingLog(
  taskId: number,
  logId: number,
  payload: UpdateMeetingLogRequest,
): Promise<MeetingLogItemResponse> {
  const res = await axiosInstance.patch<UpdateMeetingLogResponse>(
    `/reference/log/${taskId}/${logId}`,
    payload,
  );
  return res.data.data;
}
