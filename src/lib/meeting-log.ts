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

// 회의록 수정 API (PATCH /reference/log/{taskId}/{logId} → 수정된 회의록 한 건 반환)
export async function updateMeetingLog(
  taskId: number,
  logId: number,
  payload: UpdateMeetingLogRequest,
): Promise<MeetingLogItemResponse> {
  const res = await axiosInstance.patch<
    UpdateMeetingLogResponse & { data?: MeetingLogItemResponse }
  >(`/reference/log/${taskId}/${logId}`, payload);
  const raw = res.data;
  const one = raw?.data;
  if (one && typeof one === 'object' && ('log_id' in one || 'agenda' in one))
    return one as MeetingLogItemResponse;
  // data 없이 응답 본문에 회의록 객체가 직접 있는 경우 (id → log_id)
  if (raw && typeof raw === 'object' && ('log_id' in raw || 'id' in raw)) {
    const r = raw as unknown as MeetingLogItemResponse & { id?: number };
    return {
      log_id: r.log_id ?? r.id!,
      date: r.date ?? '',
      agenda: r.agenda ?? '',
      conclusion: r.conclusion ?? '',
      discussion: r.discussion ?? '',
    };
  }
  // 200인데 본문 형식이 다를 때: 보낸 payload로 성공 처리 (캐시 갱신용)
  return {
    log_id: logId,
    date: payload.date,
    agenda: payload.agenda,
    conclusion: payload.conclusion,
    discussion: payload.discussion ?? '',
  };
}

export async function deleteMeetingLog(
  taskId: number,
  logId: number,
): Promise<void> {
  await axiosInstance.delete(`/reference/log/${taskId}/${logId}`);
}
