import axiosInstance from '@/lib/axiosInstance';
import type {
  ApiResponse,
  CheckEmailResponseData,
  SendEmailCodeRequest,
  SigninRequest,
  SigninResponseData,
  SignupRequest,
  VerifyEmailCodeRequest,
} from '@/types/api/auth';

export const checkEmailDuplicate = async (
  email: string,
): Promise<CheckEmailResponseData> => {
  const res = await axiosInstance.get<ApiResponse<CheckEmailResponseData>>(
    '/auth/check-email',
    { params: { email } },
  );
  return res.data.data ?? { isDuplicate: false };
};

export const sendSignupEmailCode = async (
  body: SendEmailCodeRequest,
): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/email/send', body);
};

export const resendSignupEmailCode = async (
  body: SendEmailCodeRequest,
): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/email/resend', body);
};

export const verifySignupEmailCode = async (
  body: VerifyEmailCodeRequest,
): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/email/verify', body);
};

export const signup = async (body: SignupRequest): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/signup', body);
};

export const signin = async (
  body: SigninRequest,
): Promise<SigninResponseData> => {
  const res = await axiosInstance.post<ApiResponse<SigninResponseData>>(
    '/auth/signin',
    body,
  );

  if (!res.data.data) {
    throw new Error('로그인 응답이 올바르지 않습니다.');
  }

  return res.data.data;
};
