import { useQuery } from '@tanstack/react-query';
import { getTaskDetail } from '@/services/task';
import type { TaskDetail } from '@/types/task';

// 팀 과제 상세 조회 (GET /api/v1/task/{taskId} - create 시 입력한 정보 그대로 조회)
export const useTeamTaskDetail = (taskId: number) => {
  return useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: (): Promise<TaskDetail> => getTaskDetail(taskId),
    enabled: taskId > 0,
    select: (data): TaskDetail => ({
      ...data,
      references: [...data.references].sort(
        (a, b) => (a.referenceId ?? 0) - (b.referenceId ?? 0),
      ),
    }),
  });
};
