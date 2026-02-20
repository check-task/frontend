import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReferenceData } from '@/lib/reference';
import type { ReferenceDataType, ReferenceDataItem } from '@/types/api/reference';
import {
  getSocket,
  REFERENCE_SEND_EVENTS,
  type ReferenceCreatePayload,
} from '@/lib/socket';

/** 자료 생성 (백엔드 reference:create 소켓 또는 REST)
 * - URL 자료 + 소켓 연결 시: 소켓으로 생성 후 방 브로드캐스트로 실시간 반영
 * - 파일 자료: REST(multipart)만 지원, 소켓 미사용
 */
export const useCreateReferenceData = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      type: ReferenceDataType;
      payload: { name?: string; url?: string; file?: File };
    }) => {
      const socket = getSocket();
      const useSocket =
        socket?.connected &&
        params.type === 'url' &&
        params.payload.name != null &&
        params.payload.url != null;

      if (useSocket) {
        return new Promise<ReferenceDataItem[]>((resolve, reject) => {
          const payload: ReferenceCreatePayload = {
            taskId,
            type: 'url',
            item: {
              name: params.payload.name!,
              url: params.payload.url,
            },
          };
          socket!.emit(REFERENCE_SEND_EVENTS.CREATE, payload, (res: { success?: boolean; reason?: string }) => {
            if (res?.success) resolve([]);
            else reject(new Error(res?.reason ?? '자료 생성에 실패했습니다.'));
          });
        });
      }
      return createReferenceData(taskId, params.type, params.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    },
  });
};
