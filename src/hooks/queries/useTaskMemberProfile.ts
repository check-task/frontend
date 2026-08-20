import { useQuery } from '@tanstack/react-query';
import { getTaskMemberProfile } from '@/services/task';

export const useTaskMemberProfile = (taskId: number, userId?: number) => {
  return useQuery({
    queryKey: ['taskMemberProfile', taskId, userId],
    queryFn: () => getTaskMemberProfile(taskId, userId as number),
    enabled: taskId > 0 && userId != null,
  });
};
