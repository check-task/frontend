'use client';

import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // 초기 마운트 시 localStorage 확인
  const isAuthenticated = typeof window !== 'undefined' ? checkAuth() : false;

  // 리다이렉트를 더 빨리 시작하기 위해 useLayoutEffect 사용
  useLayoutEffect(() => {
    if (!isAuthenticated && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoggedIn, router]);

  if (!isAuthenticated && !isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
