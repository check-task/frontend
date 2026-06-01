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
