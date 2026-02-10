// 자료 생성 API 요청/응답 타입

export type ReferenceDataType = 'file' | 'url';

// 자료 한 건 (응답)
export interface ReferenceDataItem {
  reference_id: number;
  name: string;
  url: string | null;
  file_url: string | null;
}

// 자료 생성 성공 응답
export interface CreateReferenceDataResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: ReferenceDataItem[];
}
