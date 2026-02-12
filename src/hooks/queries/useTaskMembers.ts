import { useQuery } from '@tanstack/react-query';
import { getTaskMembers } from '@/services/task';

export const useTaskMembers = (taskId: number) => {
  return useQuery({
    queryKey: ['taskMembers', taskId],
    queryFn: () => getTaskMembers(taskId),
    enabled: taskId > 0,
  });
};
