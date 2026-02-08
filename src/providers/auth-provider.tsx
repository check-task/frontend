'use client';

import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

// 로그인 안되어있으면 /login으로 리다이렉트
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);

  // 마운트 시 localStorage → zustand 동기화 + 리다이렉트
  useLayoutEffect(() => {
    const hasToken = useAuthStore.getState().checkAuth();
    if (!hasToken) {
      router.replace('/login');
    }
  }, [router]);

  // 리다이렉트 전 보호된 페이지가 깜빡이지 않도록 차단
  if (!token) {
    return null;
  }

  return <>{children}</>;
}
