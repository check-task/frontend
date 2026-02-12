// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createSubTask } from '@/services/subtask';
// import { CreateSubTaskRequest } from '@/types/task';

// interface CreateSubTaskInput extends CreateSubTaskRequest {}

// // 단일 세부 task 생성 훅
// export const useCreateSubTask = (taskId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (input: CreateSubTaskInput) => createSubTask(taskId, input),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
//     },
//   });
// };
