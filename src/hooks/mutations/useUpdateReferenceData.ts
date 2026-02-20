import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReferenceData } from '@/lib/reference';
import {
  getSocket,
  REFERENCE_SEND_EVENTS,
  type ReferenceUpdatePayload,
} from '@/lib/socket';

interface UpdateReferenceParams {
  referenceId: number;
  name: string;
  url: string;
  file?: File;
}

/** 자료 수정 (백엔드 reference:update 소켓 또는 REST)
 * - URL만 수정 + 소켓 연결 시: 소켓 사용
 * - 파일 첨부 시: REST(multipart) 사용
 */
export const useUpdateReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referenceId,
      name,
      url,
      file,
    }: UpdateReferenceParams) => {
      const socket = getSocket();
      const useSocket = socket?.connected && file == null;

      if (useSocket) {
        return new Promise<unknown>((resolve, reject) => {
          const payload: ReferenceUpdatePayload = {
            taskId,
            referenceId,
            name,
            url,
          };
          socket!.emit(REFERENCE_SEND_EVENTS.UPDATE, payload, (res: { success?: boolean; reason?: string }) => {
            if (res?.success) resolve(res);
            else reject(new Error(res?.reason ?? '자료 수정에 실패했습니다.'));
          });
        });
      }
      return updateReferenceData(taskId, referenceId, { name, url, file });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
