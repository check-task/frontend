'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '@/services/subtask';

// 댓글 수정 훅 (성공 시 taskDetail 재조회)
export const useUpdateComment = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
