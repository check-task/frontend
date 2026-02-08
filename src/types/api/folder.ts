import type { FolderColor } from '@/types/folder';

// 폴더 생성 타입 정의
export interface CreateFolderRequest {
  folderTitle: string;
  color: FolderColor;
}

export interface CreateFolderResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: CreateFolderResponseData;
}

export interface CreateFolderResponseData {
  id: number;
  folderTitle: string;
  color: FolderColor;
}

// 폴더 수정 타입 정의
export interface UpdateFolderRequest {
  folderTitle: string;
  color: FolderColor;
}

// 폴더 삭제 타입 정의
export interface DeleteFolderResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
}
