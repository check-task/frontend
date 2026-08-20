'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { css } from 'styled-system/css';
import axiosInstance from '@/lib/axiosInstance';
import { SOCIAL_AGREEMENT_REQUIRED_KEY } from '@/features/login/constants/socialAgreement';
import { useAuthStore } from '@/stores/auth-store';

export default function AppleAuthCallbackPage() {
  return <CallbackHandler />;
}

function CallbackHandler() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isProcessing = useRef(false);

  const getAccessToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      const { accessToken } = response.data.data;

      if (accessToken) {
        login(accessToken);

        const params = new URLSearchParams(window.location.search);
        if (params.get('isNewUser') === 'true') {
          window.sessionStorage.setItem(SOCIAL_AGREEMENT_REQUIRED_KEY, 'true');
        }

        router.replace('/');
        return;
      }

      console.error('accessToken이 응답에 없습니다');
      router.replace('/login');
    } catch (error) {
      console.error('Apple 로그인 토큰 발급 실패:', error);
      router.replace('/login');
    }
  }, [router, login]);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    getAccessToken();
  }, [getAccessToken]);

  return <div className={loadingStyle}>로그인 처리 중...</div>;
}

const loadingStyle = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});
