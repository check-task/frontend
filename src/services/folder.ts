import type {
  CreateFolderRequest,
  CreateFolderResponse,
  CreateFolderResponseData,
  UpdateFolderRequest,
  DeleteFolderResponse,
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
export const deleteFolder = async (folderId: number): Promise<void> => {
  await axiosInstance.delete<DeleteFolderResponse>(`/user/folder/${folderId}`);
};
