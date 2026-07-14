import type {
  CreateFolderRequest,
  CreateFolderResponse,
  CreateFolderResponseData,
  UpdateFolderRequest,
  DeleteFolderResponse,
  FolderTaskGroup,
  GetFolderTasksResponse,
} from '@/types/api/folder';
import axiosInstance from '@/lib/axiosInstance';
import { folderColorToHex } from '@/lib/folder-color';

// 폴더 생성 API 호출
export const createFolder = async (
  body: CreateFolderRequest,
): Promise<CreateFolderResponseData> => {
  const res = await axiosInstance.post<CreateFolderResponse>(
    '/user/folder',
    { ...body, color: folderColorToHex(body.color) },
  );

  return res.data.data;
};

// 폴더 수정 API 호출
export const updateFolder = async (
  folderId: number,
  body: UpdateFolderRequest,
): Promise<void> => {
  await axiosInstance.patch(`/user/folder/${folderId}`, {
    ...body,
    color: folderColorToHex(body.color),
  });
};

// 폴더 삭제 API 호출
export const deleteFolder = async (
  folderId: number,
  moveTasks = false,
): Promise<void> => {
  await axiosInstance.delete<DeleteFolderResponse>(`/user/folder/${folderId}`, {
    params: { moveTasks },
  });
};

// 폴더별 과제 목록 조회 API 호출 
export const getFolderTasks = async (
  folderId: number[],
): Promise<FolderTaskGroup[]> => {
  const res = await axiosInstance.get<GetFolderTasksResponse>(
    `/user/folder/${folderId.join(',')}`,
  );
  return res.data?.data ?? [];
};
