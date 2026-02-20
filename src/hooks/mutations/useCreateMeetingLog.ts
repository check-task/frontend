import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeetingLog } from '@/lib/meeting-log';
import type {
  CreateMeetingLogRequest,
  TaskMeetingLog,
  MeetingLogItemResponse,
} from '@/types/task';
import { getSocket, LOG_SEND_EVENTS } from '@/lib/socket';

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

/** 회의록 생성 (백엔드 log:create 소켓 또는 REST) */
export const useCreateMeetingLog = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateMeetingLogRequest) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<MeetingLogItemResponse[]>((resolve, reject) => {
          socket.emit(
            LOG_SEND_EVENTS.CREATE,
            {
              taskId,
              date: body.date,
              agenda: body.agenda ?? null,
              conclusion: body.conclusion ?? null,
              discussion: body.discussion ?? null,
            },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve([]);
              else reject(new Error(res?.reason ?? '회의록 생성에 실패했습니다.'));
            },
          );
        });
      }
      return createMeetingLog(taskId, body);
    },
    onSuccess: (meetingLogsFromApi) => {
      if (meetingLogsFromApi.length > 0) {
        const meetingLogs = meetingLogsFromApi.map(mapMeetingLogItem);
        queryClient.setQueryData(
          ['taskDetail', taskId],
          (prev: { meetingLogs?: TaskMeetingLog[] } | undefined) => {
            if (!prev) return prev;
            return { ...prev, meetingLogs };
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
