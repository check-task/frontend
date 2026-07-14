import type { FolderColor } from '@/types/folder';
import type { TaskType } from '@/types/task';

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

// 폴더 상세 페이지 조회 타입 정의 - 필요한 데이터만
export interface FolderTaskGroupInfo {
  folderTitle: string;
  color: string; 
}

export interface FolderScopedTask {
  id: number;
  title: string;
  type: TaskType; // PERSONAL | TEAM
  dDay: string; 
}

export interface FolderTaskGroup {
  folderInfo: FolderTaskGroupInfo;
  tasks: FolderScopedTask[];
}

export interface GetFolderTasksResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: FolderTaskGroup[];
}
