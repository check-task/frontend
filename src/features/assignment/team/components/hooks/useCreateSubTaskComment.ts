'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubTaskComment } from '@/services/subtask';

interface CreateSubTaskCommentInput {
  subTaskId: number;
  userId: number;
  content: string;
}

// 세부 TASK 댓글 생성 훅 (성공 시 taskDetail 재조회)
export const useCreateSubTaskComment = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subTaskId, userId, content }: CreateSubTaskCommentInput) =>
      createSubTaskComment(subTaskId, { userId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};

