'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { css } from 'styled-system/css';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/stores/auth-store';
import { KAKAO_AGREEMENT_REQUIRED_KEY } from '@/features/login/constants/kakaoAgreement';

export default function AuthCallbackPage() {
  return <CallbackHandler />;
}

function CallbackHandler() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isProcessing = useRef(false); // API 중복 호출 방지

  // accessToken 발급 요청
  const getAccessToken = useCallback(async () => {
    try {
      // refreshToken 쿠키로 accessToken 발급
      const response = await axiosInstance.post('/auth/refresh');

      const { accessToken } = response.data.data;

      if (accessToken) {
        login(accessToken); // 토큰 저장
        const params = new URLSearchParams(window.location.search);
        if (params.get('isNewUser') === 'true') {
          window.sessionStorage.setItem(KAKAO_AGREEMENT_REQUIRED_KEY, 'true');
        }
        router.replace('/');
      } else {
        console.error('accessToken이 응답에 없습니다');
        router.replace('/login');
      }
    } catch (error) {
      console.error('토큰 발급 실패:', error);
      router.replace('/login');
    }
  }, [router, login]);

  // 페이지 로드 시 토큰 발급
  useEffect(() => {
    if (!isProcessing.current) {
      isProcessing.current = true;
      getAccessToken();
    }
  }, [getAccessToken]);

  return <div className={loadingStyle}>로그인 처리 중...</div>;
}

const loadingStyle = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});
