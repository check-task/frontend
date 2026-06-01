import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

// 기본 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // HttpOnly 쿠키 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 요청 중복 방지
let refreshTokenPromise: Promise<string> | null = null;

// 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 401 에러 시 자동 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isSigninRequest = originalRequest?.url?.includes('/auth/signin');

    if (isSigninRequest) {
      return Promise.reject(error);
    }

    // 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지

      // 서버 환경에서는 토큰 갱신 불가
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 (중복 요청 방지)
        if (!refreshTokenPromise) {
          refreshTokenPromise = (async () => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {},
                { withCredentials: true },
              );

              const { accessToken } = response.data.data;

              if (accessToken) {
                useAuthStore.getState().login(accessToken);
                return accessToken;
              }

              throw new Error('accessToken이 응답에 없습니다');
            } finally {
              refreshTokenPromise = null; // Promise 초기화
            }
          })();
        }

        // 새 토큰으로 원래 요청 재시도
        const newAccessToken = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 → 로그아웃 처리
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
