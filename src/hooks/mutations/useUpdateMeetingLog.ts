import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeetingLog } from '@/lib/meeting-log';
import type {
  UpdateMeetingLogRequest,
  TaskMeetingLog,
  MeetingLogItemResponse,
} from '@/types/task';

function mapMeetingLogItem(item: MeetingLogItemResponse): TaskMeetingLog {
  const dateStr =
    typeof item.date === 'string' && item.date.includes('T')
      ? item.date.slice(0, 10)
      : item.date;
  return {
    logId: item.log_id,
    date: dateStr,
    agenda: item.agenda,
    conclusion: item.conclusion,
    discussion: item.discussion,
  };
}

// 회의록 수정 뮤테이션 (성공 시 캐시에 수정된 한 건 반영 후 무효화)
export const useUpdateMeetingLog = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logId,
      ...body
    }: UpdateMeetingLogRequest & { logId: number }) =>
      updateMeetingLog(taskId, logId, body),
    onSuccess: (updatedLog) => {
      const mapped = mapMeetingLogItem(updatedLog);
      queryClient.setQueryData(
        ['taskDetail', taskId],
        (prev: { meetingLogs?: TaskMeetingLog[] } | undefined) => {
          if (!prev?.meetingLogs) return prev;
          return {
            ...prev,
            meetingLogs: prev.meetingLogs.map((log) =>
              log.logId === mapped.logId ? mapped : log,
            ),
          };
        },
      );
    },
  });
};
