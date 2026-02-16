'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getSocket,
  JOIN_TASK_ROOM,
  LEAVE_TASK_ROOM,
  TASK_UPDATED_EVENT,
  TEAM_UPDATE_EVENT,
  COMMENT_EVENTS,
} from '@/lib/socket';

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

const refetchTaskDetail = (
  queryClient: ReturnType<typeof useQueryClient>,
  taskId: number,
) => {
  if (isDev) {
    console.log('[Socket] 이벤트 수신 → taskDetail 재요청, taskId:', taskId);
  }
  queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
  queryClient
    .refetchQueries({ queryKey: ['taskDetail', taskId], type: 'active' })
    .then(() => {
      if (isDev) console.log('[Socket] taskDetail 재요청 완료, taskId:', taskId);
    });
};

/**
 * 팀 과제 상세 페이지에서 join:team(taskId)로 해당 팀 방(`task:{taskId}`)에 입장하고,
 * task:updated, team:update, comment:created|updated|deleted 수신 시 taskDetail 쿼리 무효화 후 즉시 refetch 해 전체 UI를 갱신합니다.
 * (브라우저/탭 두 개로 테스트 시, 두 번째 창도 같은 방에 들어가 있으면 이벤트를 받아 자동 반영됩니다.)
 */
export function useTaskRoomSocket(taskId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (taskId <= 0) return;

    const socket = getSocket();
    if (!socket) return;

    const joinRoom = () => {
      socket.emit(JOIN_TASK_ROOM, taskId);
      if (isDev) console.log('[Socket] join:team 전송, taskId:', taskId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
    }

    if (isDev) {
      socket.onAny((eventName, ...args) => {
        console.log('[Socket] 수신 이벤트:', eventName, args.length ? args : '');
      });
    }

    const onRefetch = () => refetchTaskDetail(queryClient, taskId);

    socket.on(TASK_UPDATED_EVENT, onRefetch);
    socket.on(TEAM_UPDATE_EVENT, onRefetch);
    socket.on(COMMENT_EVENTS.CREATED, onRefetch);
    socket.on(COMMENT_EVENTS.UPDATED, onRefetch);
    socket.on(COMMENT_EVENTS.DELETED, onRefetch);

    return () => {
      if (isDev) socket.offAny();
      socket.off('connect', joinRoom);
      socket.off(TASK_UPDATED_EVENT, onRefetch);
      socket.off(TEAM_UPDATE_EVENT, onRefetch);
      socket.off(COMMENT_EVENTS.CREATED, onRefetch);
      socket.off(COMMENT_EVENTS.UPDATED, onRefetch);
      socket.off(COMMENT_EVENTS.DELETED, onRefetch);
      socket.emit(LEAVE_TASK_ROOM, taskId);
    };
  }, [taskId, queryClient]);
}
