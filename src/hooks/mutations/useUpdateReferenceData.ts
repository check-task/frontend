import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReferenceData } from '@/lib/reference';

interface UpdateReferenceParams {
  referenceId: number;
  name: string;
  url: string;
}

// 자료 수정 뮤테이션 (성공 시 taskDetail 캐시 무효화)
export const useUpdateReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referenceId, name, url }: UpdateReferenceParams) =>
      updateReferenceData(taskId, referenceId, { name, url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};

