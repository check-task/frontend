'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/Checkbox';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import { CommentButton } from './CommentButton';
import { TeamTaskManager } from './TeamTaskManager';
import DatePicker from '@/components/DatePicker';
import { Input } from '@/components/TextField';
import { CommentEditDropdown } from './CommentEditDropdown';
import type {
  TaskDetail,
  TaskDetailSubTask,
  TaskDetailSubTaskComment,
  UpdateSubTaskStatusRequestStatus,
  SubTaskStatus,
} from '@/types/task';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateTeamSubTaskStatus } from './hooks/useUpdateSubTaskStatus';
import { useUpdateTeamSubTaskDeadline } from './hooks/useUpdateSubTaskDeadline';
import { useUpdateSubTaskAssignee } from './hooks/useUpdateSubTaskAssignee';
import { useCreateSubTaskComment } from './hooks/useCreateSubTaskComment';
import { useUpdateComment } from './hooks/useUpdateComment';
import { useDeleteComment } from './hooks/useDeleteComment';
import { useUpdateSubTaskAlarm } from '@/features/assignment/personal/components/hooks/useUpdateSubTaskAlarm';
import { useTaskMembers } from '@/hooks/queries/useTaskMembers';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { AddTaskButton } from './AddTaskButton';
import { getSocket, COMMENT_SEND_EVENTS, COMMENT_EVENTS } from '@/lib/socket';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { ArrowUpCircleIcon } from '@/components/icons/ArrowUpCircleIcon';

const sortByCompletion = (tasks: TaskDetailSubTask[]) => [
  ...tasks.filter((t) => t.status !== 'COMPLETED'),
  ...tasks.filter((t) => t.status === 'COMPLETED'),
];

const getCommentId = (
  c: TaskDetailSubTaskComment & { comment_id?: number; id?: number },
) => c.commentId ?? c.comment_id ?? c.id ?? -1;

const DEFAULT_DEADLINE_TIME = 'T23:59:59';

const hasTimeSet = (deadline?: string | Date | null): boolean => {
  if (typeof deadline !== 'string') return false;
  return deadline.includes('T') && !deadline.endsWith(':59');
};

interface TeamTaskListProps {
  taskId: number;
  subTasks?: TaskDetailSubTask[];
  maxDate?: string | Date;
  isEditMode?: boolean;
  editedTitles?: Record<number, string>;
  onTitleChange?: (subTaskId: number, title: string) => void;
  onDeleteTask?: (subTaskId: number) => void;
}

const TeamTaskList = ({
  taskId,
  subTasks = [],
  maxDate,
  isEditMode = false,
  editedTitles,
  onTitleChange,
  onDeleteTask,
}: TeamTaskListProps) => {
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>(
    {},
  );

  useEffect(() => {
    if (isEditMode) {
      setOpenComments({});
    }
  }, [isEditMode]);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {},
  );

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [deletedCommentIds, setDeletedCommentIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [alarmStateMap, setAlarmStateMap] = useState<Record<number, boolean>>(
    {},
  );
  const [sortedSubTasks, setSortedSubTasks] = useState(() => sortByCompletion(subTasks));
  useEffect(() => {
    setSortedSubTasks(sortByCompletion(subTasks));
  }, [subTasks]);

  // 체크박스 토글일 때만 layout 애니메이션 적용 (추가/삭제 등 다른 변경은 건드리지 않음)
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const animateTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const queryClient = useQueryClient();
  const { mutate: mutateStatus } = useUpdateTeamSubTaskStatus(taskId);
  const { mutate: mutateDeadline } = useUpdateTeamSubTaskDeadline(taskId);
  const { mutate: updateAssignee } = useUpdateSubTaskAssignee(taskId);
  const { mutate: updateSubTaskAlarm } = useUpdateSubTaskAlarm(taskId);
  const { mutate: createComment } = useCreateSubTaskComment(taskId);
  const { mutateAsync: updateComment } = useUpdateComment(taskId);
  const { mutate: deleteComment } = useDeleteComment(taskId);
  const { data: myInfo } = useMyInfo();
  const { data: taskMembers = [] } = useTaskMembers(taskId);
  const currentUserId = myInfo?.user?.id;
  const myNickname = myInfo?.user?.nickname ?? '';
  const teamMembersForDropdown = taskMembers
    .filter((m) => m.memberId !== currentUserId && m.name !== myNickname)
    .map((m) => ({
      id: m.memberId,
      nickname: m.name,
      profileImage: m.profileImage ?? undefined,
    }));

  // 소켓 comment:created/updated/deleted 수신 시 pending 초기화 + taskDetail refetch
  const clearPendingAndRefetch = useCallback(() => {
    setDeletedCommentIds(new Set());
    queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
    queryClient.refetchQueries({
      queryKey: ['taskDetail', taskId],
      type: 'active',
    });
  }, [queryClient, taskId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(COMMENT_EVENTS.CREATED, clearPendingAndRefetch);
    socket.on(COMMENT_EVENTS.UPDATED, clearPendingAndRefetch);
    socket.on(COMMENT_EVENTS.DELETED, clearPendingAndRefetch);

    return () => {
      socket.off(COMMENT_EVENTS.CREATED, clearPendingAndRefetch);
      socket.off(COMMENT_EVENTS.UPDATED, clearPendingAndRefetch);
      socket.off(COMMENT_EVENTS.DELETED, clearPendingAndRefetch);
    };
  }, [clearPendingAndRefetch]);

  const handleSelectAssignee = (subTaskId: number, assigneeId: number | null) => {
    updateAssignee({ taskId, subTaskId, assigneeId });
  };

  // createdAt을 yy.mm.dd, hh:mm 으로 분리 (각각 0.25rem 간격용)
  const formatCommentCreatedAt = (
    createdAt: string,
  ): { date: string; time: string } => {
    const trimmed = createdAt.trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    const dotMatch = trimmed.match(
      /^(\d{4})[.-](\d{1,2})[.-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?/,
    );
    if (isoMatch) {
      const date = new Date(trimmed);
      const pad = (n: number) => String(n).padStart(2, '0');
      return {
        date: `${String(date.getFullYear()).slice(-2)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`,
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
      };
    }
    if (dotMatch) {
      const [, y, m, d, h, min] = dotMatch;
      const yy = y!.slice(-2);
      const mm = m!.padStart(2, '0');
      const dd = d!.padStart(2, '0');
      const time =
        h != null && min != null
          ? `${h.padStart(2, '0')}:${min.padStart(2, '0')}`
          : '--:--';
      return { date: `${yy}.${mm}.${dd}`, time };
    }
    return { date: trimmed, time: '--:--' };
  };

  const getDisplayComments = (
    task: TaskDetailSubTask,
  ): TaskDetailSubTaskComment[] =>
    (task.comments ?? []).filter(
      (c) =>
        !deletedCommentIds.has(
          getCommentId(c as TaskDetailSubTaskComment & { comment_id?: number }),
        ),
    );

  const handleStatusChange = (subTaskId: number, isChecked: boolean) => {
    const previousSubTasks = sortedSubTasks;
    setShouldAnimate(true);
    clearTimeout(animateTimeoutRef.current);
    animateTimeoutRef.current = setTimeout(() => setShouldAnimate(false), 400);
    setSortedSubTasks((prev) =>
      sortByCompletion(
        prev.map((t) =>
          t.subTaskId === subTaskId
            ? { ...t, status: (isChecked ? 'COMPLETED' : 'PROGRESS') as SubTaskStatus }
            : t,
        ),
      ),
    );
    const status: UpdateSubTaskStatusRequestStatus = isChecked ? 'COMPLETED' : 'PENDING';
    mutateStatus(
      { taskId, subTaskId, status },
      { onError: () => setSortedSubTasks(previousSubTasks) },
    );
  };

  const toYYYYMMDD = (d: Date, withTime: boolean): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (withTime) {
      return `${base}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    }
    return `${base}${DEFAULT_DEADLINE_TIME}`;
  };

  const handleDeadlineChange = (
    subTaskId: number,
    date: Date | null,
    timeEnabled: boolean,
  ) => {
    const endDate = date ? toYYYYMMDD(date, timeEnabled) : null;
    if (endDate === null) {
      setAlarmStateMap((prev) => ({ ...prev, [subTaskId]: false }));
    }

    mutateDeadline({ taskId, subTaskId, endDate });
  };

  // 알림 설정 변경 핸들러
  const handleAlarmToggle = (subTaskId: number) => (next: boolean) => {
    setAlarmStateMap((prev) => ({ ...prev, [subTaskId]: next }));
    updateSubTaskAlarm({ subTaskId, isAlarm: next });
  };

  const handleCommentToggle = (taskId: number) => {
    setOpenComments((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleCommentChange = (subTaskId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [subTaskId]: value }));
  };

  const handleStartEditComment = (commentId: number, content: string) => {
    if (commentId < 0) return;
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleSubmitEditComment = (commentId: number, subTaskId: number) => {
    const content = editingContent.trim();
    if (commentId < 0 || !content) return;

    // 낙관적 캐시 업데이트 — 수정 즉시 UI 반영
    queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
      if (!old?.subTasks) return old;
      return {
        ...old,
        subTasks: old.subTasks.map((st) =>
          st.subTaskId !== subTaskId
            ? st
            : {
                ...st,
                comments: (st.comments ?? []).map((c) => {
                  const cId = getCommentId(
                    c as TaskDetailSubTaskComment & { comment_id?: number },
                  );
                  return cId === commentId ? { ...c, content } : c;
                }),
              },
        ),
      };
    });

    setEditingCommentId(null);
    setEditingContent('');

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(
        COMMENT_SEND_EVENTS.UPDATE,
        { taskId, subTaskId, commentId, content },
        (res: { success?: boolean }) => {
          if (!res?.success) updateComment({ commentId, content });
        },
      );
    } else {
      updateComment({ commentId, content });
    }
  };

  const handleDeleteComment = (
    comment: TaskDetailSubTaskComment & { comment_id?: number },
    subTaskId: number,
  ) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    const commentId = getCommentId(comment);
    if (commentId >= 0) {
      setDeletedCommentIds((prev) => new Set(prev).add(commentId));
      queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {        if (!old?.subTasks) return old;
        return {
          ...old,
          subTasks: old.subTasks.map((st) =>
            st.subTaskId !== subTaskId
              ? st
              : {
                  ...st,
                  comments: (st.comments ?? []).filter(
                    (c) =>
                      getCommentId(
                        c as TaskDetailSubTaskComment & { comment_id?: number },
                      ) !== commentId,
                  ),
                },
          ),
        };
      });
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit(
          COMMENT_SEND_EVENTS.DELETE,
          { taskId, subTaskId, commentId },
          (res: { success?: boolean }) => {
            if (!res?.success) {
              deleteComment(commentId, {
                onError: () => {
                  setDeletedCommentIds((prev) => {
                    const next = new Set(prev);
                    next.delete(commentId);
                    return next;
                  });
                  queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
                },
              });
            }
          },
        );
      } else {
        deleteComment(commentId, {
          onError: () => {
            setDeletedCommentIds((prev) => {
              const next = new Set(prev);
              next.delete(commentId);
              return next;
            });
            queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
          },
        });
      }
    } else {
      // 낙관적 댓글(commentId < 0)은 캐시에서 직접 제거
      queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
        if (!old?.subTasks) return old;
        return {
          ...old,
          subTasks: old.subTasks.map((st) =>
            st.subTaskId !== subTaskId
              ? st
              : {
                  ...st,
                  comments: (st.comments ?? []).filter(
                    (c) => c.commentId !== comment.commentId,
                  ),
                  commentCount: Math.max((st.commentCount ?? 1) - 1, 0),
                },
          ),
        };
      });
    }
  };

  const handleCommentSubmit = (subTaskId: number) => {
    const content = commentInputs[subTaskId]?.trim();
    const userId = myInfo?.user.id;
    if (!content || !userId || !myInfo) return;

    // 입력창 즉시 비우기
    setCommentInputs((prev) => ({ ...prev, [subTaskId]: '' }));

    // React Query 캐시에 직접 댓글 추가 → 즉시 UI 반영
    queryClient.setQueryData<TaskDetail>(['taskDetail', taskId], (old) => {
      if (!old?.subTasks) return old;
      return {
        ...old,
        subTasks: old.subTasks.map((st) =>
          st.subTaskId !== subTaskId
            ? st
            : {
                ...st,
                comments: [
                  ...(st.comments ?? []),
                  {
                    commentId: -Date.now(),
                    content,
                    writer: myInfo.user.nickname ?? '',
                    profileImage: myInfo.user.profileImage ?? '',
                    createdAt: new Date().toISOString(),
                  },
                ],
                commentCount: (st.commentCount ?? 0) + 1,
              },
        ),
      };
    });

    // 소켓 또는 HTTP로 서버에 전송
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(
        COMMENT_SEND_EVENTS.CREATE,
        { taskId, subTaskId, content },
        (res: { success?: boolean }) => {
          if (!res?.success) createComment({ subTaskId, userId, content });
        },
      );
    } else {
      createComment({ subTaskId, userId, content });
    }

    // 서버 데이터와 동기화 (백그라운드)
    queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
  };

  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        {sortedSubTasks.length > 0 ? (
          sortedSubTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const commentOpen = openComments[task.subTaskId] ?? false;
            const comments = getDisplayComments(task);
            return (
              <motion.div
                key={task.subTaskId}
                layout
                layoutId={`team-task-${task.subTaskId}`}
                transition={{ duration: shouldAnimate ? 0.35 : 0, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className={taskItemContainerStyle({ checked: isCompleted })}
                >
                  <div className={teamTaskItemTitleStyle}>
                    <div className={taskInnerStyle}>
                      {isEditMode ? (
                        <Input
                          size='basic'
                          width='27.875rem'
                          value={editedTitles?.[task.subTaskId] ?? task.title}
                          onChange={(e) => onTitleChange?.(task.subTaskId, e.target.value)}
                        />
                      ) : (
                        <div className={teamTaskItemCheckTitleStyle}>
                          <Checkbox
                            checked={isCompleted}
                            onChange={(e) =>
                              handleStatusChange(task.subTaskId, e.target.checked)
                            }
                          />
                          <p className={taskTextStyle({ checked: isCompleted })}>
                            {task.title}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={calendarAlarmCommentGroupStyle}>
                      <div
                        className={dateAlarmStyle}
                        style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                      >
                        <DatePicker
                          allowUnspecified
                          value={task.deadline}
                          onChange={(date, timeEnabled) =>
                            handleDeadlineChange(task.subTaskId, date, timeEnabled)
                          }
                          muted={isCompleted}
                          maxDate={maxDate}
                          initialTimeEnabled={hasTimeSet(task.deadline)}
                        />
                        <ClockToggle
                          muted={isCompleted}
                          isOn={alarmStateMap[task.subTaskId] ?? task.isAlarm}
                          onToggle={handleAlarmToggle(task.subTaskId)}
                        />
                      </div>
                      <div style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}>
                        <CommentButton
                          isOpen={commentOpen}
                          onClick={() => handleCommentToggle(task.subTaskId)}
                          commentCount={comments.length}
                          muted={isCompleted}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={rightSectionStyle({ editMode: isEditMode })}>
                    <div
                      className={managerContainerStyle}
                      style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                    >
                      <p className={managerLabelStyle}>담당:</p>
                      <TeamTaskManager
                        manager={task.assigneeName}
                        profileImage={task.assigneeProfileImage ?? undefined}
                        members={teamMembersForDropdown}
                        onSelectMember={(_, assigneeId) => {
                          if (assigneeId !== undefined)
                            handleSelectAssignee(task.subTaskId, assigneeId);
                        }}
                      />
                    </div>
                    {isEditMode && (
                      <button
                        type='button'
                        onClick={() => onDeleteTask?.(task.subTaskId)}
                        className={deleteButtonStyle}
                      >
                        <CloseIcon size={28} strokeWidth={1} color='gray.900' />
                      </button>
                    )}
                  </div>
                </div>
                {commentOpen && (
                  <div className={commentSectionStyle}>
                    <div className={inputWrapperStyle}>
                      <input
                        placeholder='댓글 추가'
                        className={commentInputStyle}
                        value={commentInputs[task.subTaskId] ?? ''}
                        onChange={(e) =>
                          handleCommentChange(task.subTaskId, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter'&& !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            handleCommentSubmit(task.subTaskId);
                          }
                        }}
                      />
                      <button
                        type='button'
                        className={inputProfileIconStyle}
                        onClick={() => handleCommentSubmit(task.subTaskId)}
                      >
                        {commentInputs[task.subTaskId]?.trim() ? (
                          <ArrowUpCircleIcon circleColor='var(--colors-blue-500)' arrowColor='var(--colors-blue-50)' />
                        ) : (
                          <ArrowUpCircleIcon circleColor='var(--colors-gray-200)' arrowColor='var(--colors-gray-400)' />
                        )}
                      </button>
                    </div>
                    <div className={commentItemContainerStyle}>
                      {comments.length > 0 ? (
                        comments.map((comment, index) => {
                          const commentWithId =
                            comment as TaskDetailSubTaskComment & {
                              comment_id?: number;
                            };
                          const id = getCommentId(commentWithId);
                          const isEditing = id >= 0 && editingCommentId === id;
                          const { date, time } = formatCommentCreatedAt(
                            comment.createdAt,
                          );
                          const isMyComment = comment.writer === myNickname;
                          return (
                            <div
                              key={
                                id >= 0
                                  ? id
                                  : `pending-${task.subTaskId}-${index}`
                              }
                              className={commentItemStyle}
                            >
                              <div className={commentItemHeaderStyle}>
                                <div className={commentAvatarNameStyle}>
                                  <div
                                    className={commentItemHeaderProfileStyle}
                                    style={
                                      comment.profileImage
                                        ? {
                                            backgroundImage: `url(${comment.profileImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                          }
                                        : undefined
                                    }
                                  />
                                  <p className={commentWriterNameStyle}>
                                    {comment.writer}
                                  </p>
                                </div>
                                <div
                                  className={commentItemEtcStyle}
                                  style={(!isEditing && isMyComment) ? undefined : { justifyContent: 'flex-end' }}
                                >
                                    <div className={commentDateTimeWrapperStyle}>
                                      <span className={commentCreatedAtStyle}>
                                        {date}
                                      </span>
                                      <span className={commentCreatedAtStyle}>
                                        {time}
                                      </span>
                                    </div>
                                    {!isEditing && isMyComment && (
                                      <CommentEditDropdown
                                        onEditComment={() =>
                                          handleStartEditComment(
                                            id,
                                            comment.content,
                                          )
                                        }
                                        onDeleteComment={() =>
                                          handleDeleteComment(
                                            comment,
                                            task.subTaskId,
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                              </div>
                              {isEditing ? (
                                <div className={commentEditWrapperStyle}>
                                  <input
                                    value={editingContent}
                                    onChange={(e) =>
                                      setEditingContent(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                        e.preventDefault();
                                        handleSubmitEditComment(
                                          id,
                                          task.subTaskId,
                                        );
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingCommentId(null);
                                        setEditingContent('');
                                      }
                                    }}
                                    className={commentEditInputStyle}
                                    autoFocus
                                  />
                                  <button
                                    type='button'
                                    className={inputProfileIconStyle}
                                    onClick={() =>
                                      handleSubmitEditComment(
                                        id,
                                        task.subTaskId,
                                      )
                                    }
                                  >
                                    {editingContent.trim() ? (
                                      <ArrowUpCircleIcon
                                        circleColor='var(--colors-blue-500)'
                                        arrowColor='var(--colors-blue-50)'
                                      />
                                    ) : (
                                      <ArrowUpCircleIcon
                                        circleColor='var(--colors-gray-200)'
                                        arrowColor='var(--colors-gray-400)'
                                      />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <p className={commentItemHeaderCommentStyle}>
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className={emptyCommentMessageStyle}>
                          등록된 댓글이 없습니다.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className={css({ textStyle: 'body3.r', color: 'gray.500' })}>
            등록된 TASK가 없습니다.
          </div>
        )}
        <AddTaskButton taskId={taskId} maxDate={maxDate} />
      </div>
    </div>
  );
};

const teamTaskListContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  p: '1.5rem',
  borderRadius: '0.75rem',
  bg: 'bg',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
  _dark: {
    boxShadow:
      '0 0 4px 0 rgba(238, 239, 241, 0.08), 0 1px 4px 0 rgba(238, 239, 241, 0.08)',
  },
});

const teamTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const teamTaskItemTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
  width: '46.5rem',
});

const taskInnerStyle = css({
  display: 'flex',
  alignItems: 'center',
  width: '27.875rem',
  flexShrink: 0,
});

const calendarAlarmCommentGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '1.25rem',
  flexShrink: 0,
});

const teamTaskItemCheckTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '27.875rem',
});

const taskItemContainerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'color 0.2s ease',
  },
  variants: {
    checked: {
      true: {
        color: 'gray.400',
      },
      false: {
        color: 'inherit',
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const taskTextStyle = cva({
  base: {
    wordBreak: 'break-word',
    flex: 1,
  },
  variants: {
    checked: {
      true: {
        textStyle: 'body1.r',
        color: 'gray.400',
        textDecoration: 'line-through',
        textDecorationThickness: '1px',
        textDecorationSkipInk: 'none',
      },
      false: {
        textStyle: 'body1.m',
        color: 'gray.900',
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const dateAlarmStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexShrink: 0,
});

const rightSectionStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    width: '13rem',
  },
  variants: {
    editMode: {
      true: { justifyContent: 'space-between' },
      false: {},
    },
  },
  defaultVariants: { editMode: false },
});


const deleteButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.75rem',
  height: '1.75rem',
  flexShrink: 0,
  cursor: 'pointer',
});

const managerContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const managerLabelStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});

// 댓글 섹션 스타일
const commentSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  w: '40.5rem',
  h: 'auto',
  pl: '2.25rem',
  mt: '1.25rem',
});

const inputWrapperStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const commentInputStyle = css({
  display: 'block',
  width: '100%',
  h: '2.5rem',
  borderRadius: '0.5rem',
  py: '0.5rem',
  pl: '1.25rem',
  pr: '3.25rem',
  border: '1px solid',
  borderColor: 'gray.200',
  bg: 'bg',
  outline: 'none',
  color: 'gray.900',
  textStyle: 'body3.r',
  _placeholder: {
    color: 'gray.400',
  },
});

const inputProfileIconStyle = css({
  position: 'absolute',
  right: '1.25rem',
  display: 'flex',
  w: '1.5rem',
  h: '1.5rem',
  cursor: 'pointer',
});

const emptyCommentMessageStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
  width: '100%',
});

// 여기서 부터 봐
const commentItemContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
});

const commentItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: 'full',
});

const commentItemHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'full',
});

const commentAvatarNameStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const commentWriterNameStyle = css({
  textStyle: 'body3.m',
  color: 'gray.700',
});

const commentItemHeaderProfileStyle = css({
  display: 'flex',
  w: '1.5rem',
  h: '1.5rem',
  borderRadius: '100%',
  bg: 'blue.100',
});

const commentItemHeaderCommentStyle = css({
  textStyle: 'body3.r',
  color: 'gray.700',
  ml: '2rem',
  w: '34.125rem',
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
});

const commentEditWrapperStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  pl: '2rem',
  width: 'full',
});

const commentEditInputStyle = css({
  display: 'block',
  width: 'full',
  h: '2.5rem',
  borderRadius: '0.5rem',
  py: '0.5rem',
  pl: '1.25rem',
  pr: '3.25rem',
  border: '1px solid',
  borderColor: 'gray.200',
  bg: 'bg',
  outline: 'none',
  color: 'gray.600',
  textStyle: 'body3.r',
  _placeholder: {
    color: 'gray.400',
  },
});

const commentItemEtcStyle = css({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'flex-end',
  justifyContent: 'space-between',
  gap: '0.25rem',
  w: '7.5rem',
  flexShrink: 0,
});

const commentDateTimeWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  mr: '0.45rem',
});

const commentCreatedAtStyle = css({
  textStyle: 'body4.r',
  color: 'gray.400',
});

export default TeamTaskList;
