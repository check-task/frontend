import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/services/task';
import type { CreateTaskRequest } from '@/types/task';

// 과제 생성 뮤테이션 (성공 시 taskList 캐시 무효화)
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTaskRequest) => createTask(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
    },
  });
};
