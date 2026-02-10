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

// 자료 수정 성공 응답
export interface UpdateReferenceDataResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: ReferenceDataItem;
}

// 자료 삭제 성공 응답
export interface DeleteReferenceDataResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: null;
}

// 커뮤니케이션 한 건 (응답)
export interface CommunicationItemResponse {
  communication_id: number;
  name: string;
  url: string;
}

// 커뮤니케이션 생성 성공 응답 (해당 과제의 전체 커뮤니케이션 목록 반환)
export interface CreateCommunicationResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: CommunicationItemResponse[];
}

// 커뮤니케이션 수정 성공 응답
export interface UpdateCommunicationResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: CommunicationItemResponse;
}

// 커뮤니케이션 삭제 성공 응답
export interface DeleteCommunicationResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: null;
}
