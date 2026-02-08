import type { User } from '@/types/api/user';
import type { Folder } from '@/types/folder';
import type {
  GetMyInfoResponse,
  UpdateProfileResponse,
  UpdateProfileResponseData,
} from '@/types/api/profile';
import axiosInstance from '@/lib/axiosInstance';

// 내 정보 조회 API 호출
export const getMyInfo = async (): Promise<{
  user: User;
  folders: Folder[];
}> => {
  const res = await axiosInstance.get<GetMyInfoResponse>('/user/me');
  const data = res.data.data;

  return {
    user: {
      id: data.userId,
      nickname: data.nickname,
      phoneNum: data.phoneNum,
      email: data.email,
      profileImage: data.profileImage,
      deadlineAlarm: data.deadlineAlarm,
      taskAlarm: data.taskAlarm,
    },
    folders: data.folders.map((f) => ({
      id: f.folderId,
      name: f.name,
      color: f.color,
    })),
  };
};

// 프로필 수정 API 호출 (multipart/form-data)
export const updateProfile = async (
  formData: FormData,
): Promise<UpdateProfileResponseData> => {
  const res = await axiosInstance.patch<UpdateProfileResponse>(
    '/user/profile',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return res.data.data;
};

// 회원 탈퇴 API 호출
export const withdrawAccount = async (): Promise<void> => {
  await axiosInstance.delete('/auth/kakao/unlink');
};
