import { useMutation } from '@tanstack/react-query';
import { verifyCurrentPassword } from '@/services/auth';
import type { PasswordVerifyRequest } from '@/types/api/auth';

export const useVerifyCurrentPassword = () => {
  return useMutation({
    mutationFn: (body: PasswordVerifyRequest) => verifyCurrentPassword(body),
  });
};
