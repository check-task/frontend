'use client';

import { useState, useEffect, useCallback } from 'react';
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

const getCommentId = (
  c: TaskDetailSubTaskComment & { comment_id?: number; id?: number },
) => c.commentId ?? c.comment_id ?? c.id ?? -1;

interface TeamTaskListProps {
  taskId: number;
  subTasks?: TaskDetailSubTask[];
  maxDate?: string | Date;
}

const TeamTaskList = ({
  taskId,
  subTasks = [],
  maxDate,
}: TeamTaskListProps) => {
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {},
  );

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [deletedCommentIds, setDeletedCommentIds] = useState<Set<number>>(
    () => new Set(),
  );
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

  const handleSelectAssignee = (subTaskId: number, assigneeId: number) => {
    updateAssignee({ subTaskId, assigneeId });
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
      const [, y, m, d, h, min] = isoMatch;
      return {
        date: `${y!.slice(-2)}.${m!}.${d!}`,
        time: `${h!.padStart(2, '0')}:${min!.padStart(2, '0')}`,
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
    const nextStatus: SubTaskStatus = isChecked ? 'COMPLETED' : 'PROGRESS';
    mutateStatus({
      subTaskId,
      status: nextStatus === 'COMPLETED' ? 'COMPLETE' : 'PROGRESS',
    });
  };

  const toYYYYMMDD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleDeadlineChange = (subTaskId: number, date: Date) => {
    mutateDeadline({ subTaskId, endDate: toYYYYMMDD(date) });
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
      socket.emit(COMMENT_SEND_EVENTS.UPDATE, {
        taskId,
        subTaskId,
        commentId,
        content,
      });
    } else {
      updateComment({ commentId, content });
    }
  };

  const handleDeleteComment = (
    comment: TaskDetailSubTaskComment & { comment_id?: number },
    subTaskId: number,
  ) => {
    const commentId = getCommentId(comment);
    if (commentId >= 0) {
      setDeletedCommentIds((prev) => new Set(prev).add(commentId));
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
        socket.emit(COMMENT_SEND_EVENTS.DELETE, {
          taskId,
          subTaskId,
          commentId,
        });
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
      socket.emit(COMMENT_SEND_EVENTS.CREATE, {
        taskId,
        subTaskId,
        content,
      });
    } else {
      createComment({ subTaskId, userId, content });
    }

    // 서버 데이터와 동기화 (백그라운드)
    queryClient.invalidateQueries({ queryKey: ['taskDetail', taskId] });
  };

  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        {subTasks.length > 0 ? (
          subTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const commentOpen = openComments[task.subTaskId] ?? false;
            const comments = getDisplayComments(task);
            return (
              <div key={task.subTaskId}>
                <div
                  className={taskItemContainerStyle({ checked: isCompleted })}
                >
                  <div className={teamTaskItemTitleStyle}>
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
                    <div
                      className={taskComponentsStyle({ checked: isCompleted })}
                    >
                      <DatePicker
                        value={task.deadline}
                        onChange={(date) =>
                          handleDeadlineChange(task.subTaskId, date)
                        }
                        muted={isCompleted}
                        maxDate={maxDate}
                      />
                      <ClockToggle
                        muted={isCompleted}
                        isOn={task.isAlarm}
                        onToggle={(next) =>
                          updateSubTaskAlarm({
                            subTaskId: task.subTaskId,
                            isAlarm: next,
                          })
                        }
                      />
                      <CommentButton
                        isOpen={commentOpen}
                        onClick={() => handleCommentToggle(task.subTaskId)}
                        commentCount={comments.length}
                      />
                    </div>
                  </div>
                  <div
                    className={managerContainerStyle({ checked: isCompleted })}
                  >
                    <p className={managerLabelStyle({ checked: isCompleted })}>
                      담당:
                    </p>
                    <TeamTaskManager
                      manager={task.assigneeName}
                      profileImage={task.assigneeProfileImage ?? undefined}
                      members={teamMembersForDropdown}
                      onSelectMember={(_, assigneeId) => {
                        if (assigneeId != null)
                          handleSelectAssignee(task.subTaskId, assigneeId);
                      }}
                    />
                  </div>
                </div>
                {commentOpen && (
                  <div className={commentSectionStyle}>
                    <div className={inputWrapperStyle}>
                      <Input
                        size='basic'
                        placeholder='댓글 추가'
                        className={commentInputStyle}
                        value={commentInputs[task.subTaskId] ?? ''}
                        onChange={(e) =>
                          handleCommentChange(task.subTaskId, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCommentSubmit(task.subTaskId);
                          }
                        }}
                      />
                      <div
                        className={inputProfileIconStyle}
                        style={
                          myInfo?.user.profileImage
                            ? {
                                backgroundImage: `url(${myInfo.user.profileImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }
                            : undefined
                        }
                        onClick={() => handleCommentSubmit(task.subTaskId)}
                      />
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
                                <div className={commentNameContentWrapperStyle}>
                                  <p className={commentWriterNameStyle}>
                                    {comment.writer}
                                  </p>
                                  {isEditing ? (
                                    <Input
                                      size='basic'
                                      value={editingContent}
                                      onChange={(e) =>
                                        setEditingContent(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
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
                                  ) : (
                                    <p
                                      className={commentItemHeaderCommentStyle}
                                    >
                                      {comment.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {!isEditing &&
                                (() => {
                                  const { date, time } = formatCommentCreatedAt(
                                    comment.createdAt,
                                  );
                                  const isMyComment =
                                    comment.writer === myNickname;
                                  return (
                                    <div className={commentItemEtcStyle}>
                                      <div
                                        className={commentDateTimeWrapperStyle}
                                      >
                                        <span className={commentCreatedAtStyle}>
                                          {date}
                                        </span>
                                        <span className={commentCreatedAtStyle}>
                                          {time}
                                        </span>
                                      </div>
                                      {isMyComment && (
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
                                  );
                                })()}
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
              </div>
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
  shadow: '0px 1px 4px 0px #00000029',
});

const teamTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const teamTaskItemTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '46.125rem',
});

const teamTaskItemCheckTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
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
    textStyle: 'body1.r',
    transition: 'all 0.2s ease',
  },
  variants: {
    checked: {
      true: {
        color: 'gray.400',
        textDecoration: 'line-through',
      },
      false: {
        color: 'gray.900',
        textDecoration: 'none',
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const taskComponentsStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    transition: 'opacity 0.2s ease',
  },
  variants: {
    checked: {
      true: {
        opacity: 0.4,
      },
      false: {
        opacity: 1,
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const managerContainerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'opacity 0.2s ease',
  },
  variants: {
    checked: {
      true: {
        opacity: 0.4,
      },
      false: {
        opacity: 1,
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const managerLabelStyle = cva({
  base: {
    textStyle: 'body3',
    transition: 'color 0.2s ease',
  },
  variants: {
    checked: {
      true: {
        color: 'gray.400',
      },
      false: {
        color: 'gray.600',
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const commentSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  w: '37.5rem',
  h: 'auto',
  ml: '2.25rem',
});

const inputWrapperStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const commentInputStyle = css({
  width: '100%',
  paddingRight: '3rem',
});

const inputProfileIconStyle = css({
  position: 'absolute',
  right: '0.75rem',
  display: 'flex',
  w: '1.5rem',
  h: '1.5rem',
  borderRadius: '100%',
  bg: 'blue.100',
  cursor: 'pointer',
  overflow: 'hidden',
});

const emptyCommentMessageStyle = css({
  textStyle: 'body3.r',
  color: 'gray.500',
  width: '100%',
});

const commentItemContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
});

const commentItemStyle = css({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  width: 'full',
});

const commentItemHeaderStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
});

const commentNameContentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const commentWriterNameStyle = css({
  textStyle: 'body2.m',
  color: 'gray.900',
});

const commentItemHeaderProfileStyle = css({
  display: 'flex',
  w: '1.5rem',
  h: '1.5rem',
  borderRadius: '100%',
  bg: 'blue.100',
});

const commentItemHeaderCommentStyle = css({
  textStyle: 'body3',
  color: 'gray.700',
  ml: '0.125rem',
});

const commentEditInputStyle = css({
  flex: 1,
  minWidth: 0,
});

const commentItemEtcStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

const commentDateTimeWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

const commentCreatedAtStyle = css({
  fontSize: '0.875rem',
  color: 'gray.400',
});

export default TeamTaskList;
