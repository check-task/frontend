'use client';

import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Socket 연결 URL = origin만 사용 (경로 제외).
 * NEXT_PUBLIC_API_URL 이 "https://checktask.p-e.kr/api/v1" 이면 Socket은 "https://checktask.p-e.kr" 로 연결해야 함.
 * 경로를 그대로 쓰면 Socket.IO가 경로를 namespace로 인식해 "Invalid namespace" 가 난다.
 */
const getSocketBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const raw =
    process.env.NEXT_PUBLIC_WS_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  if (!raw) return '';
  try {
    const url = new URL(raw.replace(/\/$/, ''));
    return url.origin;
  } catch {
    return raw.replace(/\/$/, '');
  }
};

/**
 * Socket.IO 엔드포인트 경로.
 * 기본값은 루트 '/socket.io'. 백엔드가 다른 경로에 두면 .env에 NEXT_PUBLIC_WS_PATH 지정 (예: /api/v1/socket.io).
 */
const getSocketPath = (): string => {
  const envPath = process.env.NEXT_PUBLIC_WS_PATH;
  if (envPath && typeof envPath === 'string') return envPath;
  return '/socket.io';
};

/**
 * Socket.io namespace. 백엔드는 기본 namespace(/)만 사용하고 room(`task:${taskId}`)으로 구분하므로
 * 기본값은 빈 문자열(기본 "/" 연결). 다른 서버 규격이면 .env에 NEXT_PUBLIC_WS_NAMESPACE 지정.
 */
const getSocketNamespace = (): string => {
  const ns = process.env.NEXT_PUBLIC_WS_NAMESPACE ?? '';
  return typeof ns === 'string' && ns.startsWith('/') ? ns : '';
};

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    useAuthStore.getState().accessToken ?? localStorage.getItem('accessToken')
  );
};

let socket: Socket | null = null;

/**
 * Socket 인증 시 토큰 앞에 "Bearer " 붙일지 여부.
 * 기본값 false(토큰만 전달). 백엔드가 "Bearer {token}" 형식을 요구하면 .env에 NEXT_PUBLIC_SOCKET_AUTH_BEARER=true 설정.
 */
const shouldUseBearerPrefix = (): boolean =>
  process.env.NEXT_PUBLIC_SOCKET_AUTH_BEARER === 'true';

/**
 * 팀 과제 실시간 동기화용 Socket.io 클라이언트 싱글톤
 * - 연결 시 auth에 JWT 전달 (재연결 시에도 최신 토큰 사용)
 * - 방 참여: joinTaskRoom(taskId)
 */
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  const baseUrl = getSocketBaseUrl();
  if (!baseUrl) return null;

  const namespace = getSocketNamespace();
  const url = namespace ? `${baseUrl}${namespace}` : baseUrl;

  if (!socket) {
    const socketPath = getSocketPath();
    socket = io(url, {
      path: socketPath,
      transports: ['polling', 'websocket'],
      // 소켓 인증은 auth 콜백(JWT)만 사용. 백엔드는 origin 구체 지정 + credentials: true 유지해도 됨.
      withCredentials: false,
      autoConnect: true,
      auth: (cb) => {
        const token = getAccessToken();
        const value = token
          ? shouldUseBearerPrefix()
            ? `Bearer ${token}`
            : token
          : '';
        cb({ token: value });
      },
    });
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.log(
        '[Socket] 연결 시도:',
        url,
        'path:',
        socketPath,
        namespace ? `(namespace: ${namespace})` : '(기본 namespace /)',
      );
      socket.on('connect', () =>
        console.log('[Socket] 연결됨, id:', socket?.id),
      );
      socket.on('connect_error', (err) => {
        console.error('[Socket] 연결 실패:', err.message);
        if (err.message === 'Invalid namespace') {
          console.info(
            '[Socket] 연결 URL은 origin만 사용합니다(예: https://도메인). NEXT_PUBLIC_WS_NAMESPACE 삭제, 또는 NEXT_PUBLIC_WS_URL을 소켓 주소(경로 없음)로 설정 후 재시작·새로고침.',
          );
        }
        if (
          err.message?.includes('Authentication') ||
          err.message?.includes('토큰') ||
          err.message?.includes('invalid token')
        ) {
          console.info(
            '[Socket] 인증 실패: 로그인 상태 확인 또는 토큰 갱신 후 새로고침. 백엔드가 "Bearer " 접두사 없이 JWT만 받으면 .env에 NEXT_PUBLIC_SOCKET_AUTH_BEARER=false 설정.',
          );
        }
      });
    }
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** 팀 세부 페이지 방 입장 (백엔드 taskEvents.JOIN_TASK, 인자: taskId) */
export const JOIN_TASK_ROOM = 'joinTaskRoom';
/** 팀 세부 페이지 방 이탈 (백엔드 taskEvents.LEAVE_TASK, 인자: taskId) */
export const LEAVE_TASK_ROOM = 'leaveTaskRoom';

/** 클라이언트 → 서버: 과제 수정 (백엔드 taskEvents.UPDATE_TASK) */
export const TASK_UPDATE_SEND_EVENT = 'task:update';
/** 서버 → 클라이언트: 과제 전체 갱신 시 */
export const TASK_UPDATED_EVENT = 'task:updated';

/** 클라이언트 → 서버: 세부과제 상태 (백엔드 taskEvents.UPDATE_SUBTASK) payload: { taskId, subTaskId, status } */
export const SOCKET_UPDATE_SUBTASK = 'updateSubtaskStatus';
/** 클라이언트 → 서버: 세부과제 마감일 (백엔드 taskEvents.UPDATE_DEADLINE) payload: { taskId, subTaskId, endDate } */
export const SOCKET_UPDATE_DEADLINE = 'updateDeadline';
/** 클라이언트 → 서버: 세부과제 담당자 (백엔드 taskEvents.SET_ASSIGNEE) payload: { taskId, subTaskId, assigneeId } */
export const SOCKET_SET_ASSIGNEE = 'setSubTaskAssignee';
/** 클라이언트 → 서버: 단일 세부과제 생성 (백엔드 taskEvents.CREATE_SUBTASK) payload: { taskId, title?, deadline?, isAlarm? } */
export const SOCKET_CREATE_SUBTASK = 'subtask:create';
/** 클라이언트 → 서버: 세부과제 선택 수정 (백엔드 taskEvents.UPDATE_SUBTASKS) payload: { taskId, data: [{ subTaskId, title?, endDate?, isAlarm? }] } */
export const SOCKET_UPDATE_SUBTASKS = 'subtask:update';
/** 클라이언트 → 서버: 세부과제 선택 삭제 (백엔드 taskEvents.DELETED_SUBTASKS) payload: { taskId, subTaskIds: number[] } */
export const SOCKET_DELETE_SUBTASKS = 'subtask:delete';
/** 클라이언트 → 서버: 세부과제 전체 삭제 (백엔드 taskEvents.DELETED_ALL_SUBTASKS) payload: { taskId } */
export const SOCKET_DELETE_ALL_SUBTASKS = 'subtask:deleteAll';
/** 클라이언트 → 서버: 멤버 역할 변경 (백엔드 taskEvents.UPDATE_MEMBER) payload: { taskId, userId, role: 0|1 } */
export const SOCKET_UPDATE_MEMBER = 'member:update';

/** 자료: 클라이언트 → 서버 (백엔드 referenceEvents) */
export const REFERENCE_SEND_EVENTS = {
  CREATE: 'reference:create',
  UPDATE: 'reference:update',
  DELETE: 'reference:delete',
} as const;
/** 커뮤니케이션: 클라이언트 → 서버 (백엔드 communicationEvents) */
export const COMMUNICATION_SEND_EVENTS = {
  CREATE: 'communication:create',
  UPDATE: 'communication:update',
  DELETE: 'communication:delete',
} as const;
/** 회의록: 클라이언트 → 서버 (백엔드 logEvents) */
export const LOG_SEND_EVENTS = {
  CREATE: 'log:create',
  UPDATE: 'log:update',
  DELETE: 'log:delete',
} as const;
/** 백엔드 socket.util emitTeamUpdate 가 보내는 이벤트 (수신 시 동일하게 taskDetail 무효화) */
export const TEAM_UPDATE_EVENT = 'team:update';

/**
 * 백엔드가 task 방에 브로드캐스트하는 모든 갱신 이벤트.
 * 이 중 하나라도 수신하면 taskDetail refetch로 실시간 반영.
 */
export const TASK_ROOM_UPDATE_EVENTS = [
  TASK_UPDATED_EVENT,
  TEAM_UPDATE_EVENT,
  'subtaskStatusUpdated',
  'deadlineUpdated',
  'subtaskAssigneeUpdated',
  'member:updated',
  'subtask:created',
  'subtask:updated',
  'subtask:deleted',
  'subtask:deletedAll',
  'reference:created',
  'reference:updated',
  'reference:deleted',
  'comment:created',
  'comment:updated',
  'comment:deleted',
  'communication:created',
  'communication:updated',
  'communication:deleted',
  'log:created',
  'log:updated',
  'log:deleted',
] as const;

/** 과제 수정 소켓 페이로드 (task:update) */
export interface TaskUpdatePayload {
  taskId: number;
  title: string;
  deadline: string;
  folderId: number;
  subTasks: {
    title: string;
    status: string;
    endDate: string;
  }[];
  references: { name: string; url: string }[];
}

/** 댓글: 클라이언트 → 서버 (명령) */
export const COMMENT_SEND_EVENTS = {
  CREATE: 'comment:create',
  UPDATE: 'comment:update',
  DELETE: 'comment:delete',
} as const;

/** 댓글: 서버 → 클라이언트 (결과) */
export const COMMENT_EVENTS = {
  CREATED: 'comment:created',
  UPDATED: 'comment:updated',
  DELETED: 'comment:deleted',
} as const;

export interface CommentCreatePayload {
  taskId: number;
  subTaskId: number;
  content: string;
}
export interface CommentUpdatePayload {
  taskId: number;
  subTaskId: number;
  commentId: number;
  content: string;
}
export interface CommentDeletePayload {
  taskId: number;
  subTaskId: number;
  commentId: number;
}

/** 자료 생성 (reference:create) - type 'url' 시 item.url, 'file' 시 item.file_url */
export interface ReferenceCreatePayload {
  taskId: number;
  type: 'url' | 'file';
  item: { name: string; url?: string; file_url?: string };
}
export interface ReferenceUpdatePayload {
  taskId: number;
  referenceId: number;
  name?: string;
  url?: string;
  file_url?: string;
}
export interface ReferenceDeletePayload {
  taskId: number;
  referenceId: number;
}

/** 커뮤니케이션 (communication:create/update) */
export interface CommunicationCreatePayload {
  taskId: number;
  name: string;
  url: string;
}
export interface CommunicationUpdatePayload {
  taskId: number;
  communicationId: number;
  name: string;
  url: string;
}
export interface CommunicationDeletePayload {
  taskId: number;
  communicationId: number;
}

/** 회의록 (log:create/update/delete) */
export interface LogCreatePayload {
  taskId: number;
  date: string;
  agenda?: string | null;
  conclusion?: string | null;
  discussion?: string | null;
}
export interface LogUpdatePayload {
  taskId: number;
  logId: number;
  date: string;
  agenda?: string | null;
  conclusion?: string | null;
  discussion?: string | null;
}
export interface LogDeletePayload {
  taskId: number;
  logId: number;
}
