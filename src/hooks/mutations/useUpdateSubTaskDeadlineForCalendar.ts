import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubTaskDeadline } from '@/services/subtask';
import type {
  HomeAssignment,
  HomeSubTask,
} from '@/hooks/queries/useHomeTaskList';

type HomeTaskListCache = {
  assignments: HomeAssignment[];
  subTasks: HomeSubTask[];
};

const isHomeTaskListQueryKey = (queryKey: readonly unknown[]) =>
  queryKey[0] === 'taskList' &&
  typeof queryKey[1] === 'object' &&
  queryKey[1] !== null &&
  'sort' in queryKey[1];

const isHomeTaskListCache = (data: unknown): data is HomeTaskListCache =>
  typeof data === 'object' &&
  data !== null &&
  Array.isArray((data as HomeTaskListCache).assignments) &&
  Array.isArray((data as HomeTaskListCache).subTasks);

// 캘린더에서 세부과제 드래그 시 마감일 변경 훅 (taskList 무효화)
export const useUpdateSubTaskDeadlineForCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subTaskId,
      endDate,
    }: {
      subTaskId: number;
      endDate: string | null;
    }) => updateSubTaskDeadline(subTaskId, { endDate }),
    onMutate: async ({ subTaskId, endDate }) => {
      const dueDate = endDate ? endDate.split('T')[0] : null;
      const deadlineTime = endDate?.includes('T')
        ? endDate.split('T')[1]
        : undefined;

      await queryClient.cancelQueries({
        predicate: (query) => isHomeTaskListQueryKey(query.queryKey),
      });

      const previousHomeTaskLists =
        queryClient.getQueriesData<HomeTaskListCache>({
          predicate: (query) => isHomeTaskListQueryKey(query.queryKey),
        });

      queryClient.setQueriesData<HomeTaskListCache>(
        { predicate: (query) => isHomeTaskListQueryKey(query.queryKey) },
        (old) => {
          if (!isHomeTaskListCache(old)) return old;

          return {
            ...old,
            subTasks: old.subTasks.map((st) =>
              st.subTaskId === subTaskId
                ? { ...st, dueDate, deadlineTime }
                : st,
            ),
          };
        },
      );

      return { previousHomeTaskLists };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => isHomeTaskListQueryKey(query.queryKey),
      });
    },
    onError: (_error, _variables, context) => {
      context?.previousHomeTaskLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      queryClient.invalidateQueries({
        predicate: (query) => isHomeTaskListQueryKey(query.queryKey),
      });
    },
  });
};
