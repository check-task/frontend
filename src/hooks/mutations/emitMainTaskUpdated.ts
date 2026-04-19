import {
  getSocket,
  TASK_UPDATE_SEND_EVENT,
  type TaskUpdatePayload,
} from '@/lib/socket';

interface MainTaskUpdateBody {
  title: string;
  deadline: string;
  folderId: number | null;
}

export const emitMainTaskUpdated = (
  taskId: number,
  body: MainTaskUpdateBody,
) => {
  const socket = getSocket();
  if (!socket) return;

  const payload: TaskUpdatePayload = {
    taskId,
    body,
  };

  const send = () => {
    socket.emit(
      TASK_UPDATE_SEND_EVENT,
      payload,
      (res?: { success?: boolean; reason?: string }) => {
        if (res?.success === false) {
          console.error('[Socket][task:update] failed', res.reason);
        }
      },
    );
  };

  if (socket.connected) {
    send();
    return;
  }

  socket.once('connect', send);
  socket.connect();
};
