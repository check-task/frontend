import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/services/user';

// 프로필 수정 커스텀 훅
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};
