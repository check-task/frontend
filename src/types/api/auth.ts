export interface ApiResponse<T = null> {
  resultType: 'SUCCESS' | 'FAIL';
  message?: string;
  data?: T;
}

export interface CheckEmailResponseData {
  isDuplicate: boolean;
}

export interface SendEmailCodeRequest {
  email: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninUser {
  id: number;
  email: string;
  nickname: string;
}

export interface SigninSuccessData {
  accessToken: string;
  accessTokenExpireIn: number;
  user: SigninUser;
}

export interface SigninWithdrawnData {
  withdrawnUser: true;
  restoreToken: string;
}

export type SigninResponseData = SigninSuccessData | SigninWithdrawnData;

export interface RestoreLocalAccountRequest {
  token: string;
}

export interface RestoreLocalAccountResponseData {
  accessToken: string;
  accessTokenExpireIn: number;
}

export interface PasswordResetSendCodeRequest {
  email: string;
}

export interface PasswordResetVerifyCodeRequest {
  email: string;
  code: string;
}

export interface PasswordResetVerifyCodeResponseData {
  resetToken: string;
}

export interface PasswordResetConfirmRequest {
  resetToken: string;
  newPassword: string;
}
