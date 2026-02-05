import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskStatus } from '@/services/subtask';
import { UpdateSubTaskStatusRequestStatus } from '@/types/task';

interface UpdateSubTaskStatusInput {
  subTaskId: number;
  status: UpdateSubTaskStatusRequestStatus;
}

// 세부 TASK 완료 상태 변경 훅
export const useUpdateSubTaskStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, status }: UpdateSubTaskStatusInput) =>
      // 세부 task 완료 상태 변경 api 호출
      updateSubTaskStatus(subTaskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
