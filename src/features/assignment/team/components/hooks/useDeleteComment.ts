'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@/services/subtask';

// 댓글 삭제 훅 (성공 시 taskDetail 재조회)
export const useDeleteComment = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
