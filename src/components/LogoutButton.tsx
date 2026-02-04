'use client';

import { useRouter } from 'next/navigation';
import { cva } from 'styled-system/css';
import { LogoutIcon } from './icons/LogoutIcon';
import { useAuthStore } from '@/stores/auth-store';
import axiosInstance from '@/lib/axiosInstance';

// collapsed: 버튼 축소 여부
interface LogoutButtonProps {
  collapsed?: boolean;
}

export const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 실패:', error);
    } finally {
      // API 실패해도 클라이언트에서 로그아웃 처리
      logout();
      router.push('/login');
    }
  };

  const logoutButtonStyle = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      textStyle: 'body3.r',
      color: 'gray.500',
      cursor: 'pointer',
      ml: '0.4rem',
    },
  });

  const iconWrapperStyle = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      w: '1.25rem',
      h: '1.25rem',
    },
  });

  const spanStyle = cva({
    base: {
      transition:
        'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      whiteSpace: 'nowrap',
    },
    variants: {
      collapsed: {
        true: {
          opacity: 0,
          w: 0,
          overflow: 'hidden',
        },
        false: {
          opacity: 1,
          w: 'auto',
        },
      },
    },
  });

  return (
    <button className={logoutButtonStyle()} onClick={handleLogout}>
      <div className={iconWrapperStyle()}>
        <LogoutIcon />
      </div>
      <span className={spanStyle({ collapsed })}>로그아웃</span>
    </button>
  );
};
