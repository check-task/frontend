import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { withdrawAccount } from '@/services/user';
import { useAuthStore } from '@/stores/auth-store';

// 회원 탈퇴 커스텀 훅
export const useWithdraw = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: () => withdrawAccount(),
    onSuccess: () => {
      logout();
      router.push('/login');
    },
  });
};
