import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/services/auth';
import type { PasswordChangeRequest } from '@/types/api/auth';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (body: PasswordChangeRequest) => changePassword(body),
  });
};
