import axiosInstance from '@/lib/axiosInstance';
import type {
  ReferenceDataType,
  CreateReferenceDataResponse,
  ReferenceDataItem,
  CreateCommunicationResponse,
  CommunicationItemResponse,
} from '@/types/api/reference';

// 자료 생성 API 호출 (URL 또는 파일, multipart/form-data)
export async function createReferenceData(
  taskId: number,
  type: ReferenceDataType,
  payload: { name?: string; url?: string; file?: File },
): Promise<ReferenceDataItem[]> {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (type === 'url' && payload.url !== undefined)
    formData.append('url', payload.url);
  if (type === 'file' && payload.file) formData.append('file_url', payload.file);

  const res = await axiosInstance.post<CreateReferenceDataResponse>(
    `/reference/data/${taskId}`,
    formData,
    {
      params: { type },
      // multipart boundary 자동 설정을 위해 Content-Type 제거
      headers: { 'Content-Type': undefined } as unknown as Record<string, string>,
    },
  );
  return res.data.data;
}

// 커뮤니케이션 생성 API 호출 (name, url → 전체 커뮤니케이션 목록 반환)
export async function createCommunication(
  taskId: number,
  payload: { name: string; url: string },
): Promise<CommunicationItemResponse[]> {
  const res = await axiosInstance.post<CreateCommunicationResponse>(
    `/reference/communication/${taskId}`,
    payload,
  );
  return res.data.data;
}
