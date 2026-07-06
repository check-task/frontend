import axiosInstance from '@/lib/axiosInstance';
import type {
  ApiResponse,
  CheckEmailResponseData,
  PasswordResetConfirmRequest,
  PasswordResetSendCodeRequest,
  PasswordResetVerifyCodeRequest,
  PasswordResetVerifyCodeResponseData,
  RestoreLocalAccountRequest,
  RestoreLocalAccountResponseData,
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
  const formData = new FormData();

  formData.append('email', body.email);
  formData.append('password', body.password);
  formData.append('nickname', body.nickname);

  if (body.phoneNum) {
    formData.append('phoneNum', body.phoneNum);
  }

  if (body.profileImage) {
    formData.append('profileImage', body.profileImage);
  }

  await axiosInstance.post<ApiResponse>('/auth/signup', formData, {
    headers: { 'Content-Type': undefined } as unknown as Record<string, string>,
  });
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

export const restoreLocalAccount = async (
  token: RestoreLocalAccountRequest['token'],
): Promise<RestoreLocalAccountResponseData> => {
  const res = await axiosInstance.post<
    ApiResponse<RestoreLocalAccountResponseData>
  >('/auth/local/restore', { token });

  if (!res.data.data) {
    throw new Error('계정 복구 응답이 올바르지 않습니다.');
  }

  return res.data.data;
};

export const sendPasswordResetCode = async (
  body: PasswordResetSendCodeRequest,
): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/password/reset/send', body);
};

export const verifyPasswordResetCode = async (
  body: PasswordResetVerifyCodeRequest,
): Promise<PasswordResetVerifyCodeResponseData> => {
  const res = await axiosInstance.post<
    ApiResponse<PasswordResetVerifyCodeResponseData>
  >('/auth/password/reset/verify', body);

  if (!res.data.data) {
    throw new Error('인증코드 검증 응답이 올바르지 않습니다.');
  }

  return res.data.data;
};

export const confirmPasswordReset = async (
  body: PasswordResetConfirmRequest,
): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/password/reset/confirm', body);
};
