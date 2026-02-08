import type { FolderColor } from '@/types/folder';

// 내 정보 조회 타입 정의
export interface GetMyInfoResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: GetMyInfoResponseData;
}

export interface GetMyInfoResponseData {
  userId: number;
  nickname: string;
  phoneNum: string;
  email: string;
  profileImage: string;
  deadlineAlarm: number;
  taskAlarm: number;
  folders: Array<{
    folderId: number;
    name: string;
    color: FolderColor;
  }>;
}

// 프로필 수정 타입 정의
export interface UpdateProfileResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: UpdateProfileResponseData;
}

export interface UpdateProfileResponseData {
  userId: number;
  nickname: string;
  phoneNum: string;
  email: string;
  profileImage: string;
  updatedAt: string;
}
