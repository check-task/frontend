import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeetingLog } from '@/lib/meeting-log';
import type {
  CreateMeetingLogRequest,
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

// 회의록 생성 뮤테이션 (성공 시 캐시에 전체 목록 반영 후 무효화)
export const useCreateMeetingLog = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateMeetingLogRequest) =>
      createMeetingLog(taskId, body),
    onSuccess: (meetingLogsFromApi) => {
      const meetingLogs = meetingLogsFromApi.map(mapMeetingLogItem);
      queryClient.setQueryData(
        ['taskDetail', taskId],
        (prev: { meetingLogs?: TaskMeetingLog[] } | undefined) => {
          if (!prev) return prev;
          return { ...prev, meetingLogs };
        },
      );
    },
  });
};
