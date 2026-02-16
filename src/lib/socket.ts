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
    process.env.NEXT_PUBLIC_WS_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    '';
  if (!raw) return '';
  try {
    const url = new URL(raw.replace(/\/$/, ''));
    return url.origin;
  } catch {
    return raw.replace(/\/$/, '');
  }
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
  return useAuthStore.getState().accessToken ?? localStorage.getItem('accessToken');
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
 * - 방 참여: join:team(taskId)
 */
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  const baseUrl = getSocketBaseUrl();
  if (!baseUrl) return null;

  const namespace = getSocketNamespace();
  const url = namespace ? `${baseUrl}${namespace}` : baseUrl;

  if (!socket) {
    socket = io(url, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      auth: (cb) => {
        const token = getAccessToken();
        const value = token
          ? (shouldUseBearerPrefix() ? `Bearer ${token}` : token)
          : '';
        cb({ token: value });
      },
    });
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Socket] 연결 시도:', url, namespace ? `(namespace: ${namespace})` : '(기본 namespace /)');
      socket.on('connect', () => console.log('[Socket] 연결됨, id:', socket?.id));
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

/** 팀 세부 페이지 방 입장 (서버에서 socket.join(`task:${taskId}`) 처리, 인자: taskId) */
export const JOIN_TASK_ROOM = 'join:team';
/** 팀 세부 페이지 방 이탈 (인자: taskId) */
export const LEAVE_TASK_ROOM = 'leave:team';

/** 클라이언트 → 서버: 과제 수정 요청 */
export const TASK_UPDATE_SEND_EVENT = 'task:update';
/** 클라이언트 → 서버: 세부 TASK(체크/날짜/담당자) 변경 후 방 갱신 요청, payload: { taskId } */
export const TASK_REQUEST_REFRESH_EVENT = 'task:request_refresh';
/** 서버 → 클라이언트: 과제 전체 갱신 시 */
export const TASK_UPDATED_EVENT = 'task:updated';
/** 백엔드 socket.util emitTeamUpdate 가 보내는 이벤트 (수신 시 동일하게 taskDetail 무효화) */
export const TEAM_UPDATE_EVENT = 'team:update';

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
