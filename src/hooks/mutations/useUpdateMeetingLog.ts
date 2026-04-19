import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeetingLog } from '@/lib/meeting-log';
import type {
  UpdateMeetingLogRequest,
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

/** 회의록 수정 (백엔드 log:update 소켓 또는 REST) */
export const useUpdateMeetingLog = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      ...body
    }: UpdateMeetingLogRequest & { logId: number }) => {
      const socket = getSocket();
      if (socket?.connected) {
        return new Promise<MeetingLogItemResponse | undefined>((resolve, reject) => {
          socket.emit(
            LOG_SEND_EVENTS.UPDATE,
            {
              taskId,
              logId,
              date: body.date,
              agenda: body.agenda ?? null,
              conclusion: body.conclusion ?? null,
              discussion: body.discussion ?? null,
            },
            (res: { success?: boolean; reason?: string }) => {
              if (res?.success) resolve(undefined);
              else reject(new Error(res?.reason ?? '회의록 수정에 실패했습니다.'));
            },
          );
        });
      }
      return updateMeetingLog(taskId, logId, body);
    },
    onSuccess: (updatedLog) => {
      if (updatedLog) {
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
      }
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
