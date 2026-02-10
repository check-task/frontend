'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import { CommentButton } from './CommentButton';
import { TeamTaskManager } from './TeamTaskManager';
import DatePicker from '@/components/DatePicker';
import { Input } from '@/components/TextField';
import { CommentEditDropdown } from './CommentEditDropdown';
import type {
  TaskDetailSubTask,
  TaskDetailSubTaskComment,
  SubTaskStatus,
} from '@/types/task';
import { useUpdateTeamSubTaskStatus } from './hooks/useUpdateSubTaskStatus';
import { useUpdateTeamSubTaskDeadline } from './hooks/useUpdateSubTaskDeadline';
import { useCreateSubTaskComment } from './hooks/useCreateSubTaskComment';
import { useUpdateComment } from './hooks/useUpdateComment';
import { useDeleteComment } from './hooks/useDeleteComment';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

interface TeamTaskListProps {
  taskId: number;
  subTasks?: TaskDetailSubTask[];
}

const TeamTaskList = ({ taskId, subTasks = [] }: TeamTaskListProps) => {
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [pendingComments, setPendingComments] = useState<
    Record<number, TaskDetailSubTaskComment[]>
  >({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const { mutate: mutateStatus } = useUpdateTeamSubTaskStatus(taskId);
  const { mutate: mutateDeadline } = useUpdateTeamSubTaskDeadline(taskId);
  const { mutate: createComment } = useCreateSubTaskComment(taskId);
  const { mutateAsync: updateComment } = useUpdateComment(taskId);
  const { mutate: deleteComment } = useDeleteComment(taskId);
  const { data: myInfo } = useMyInfo();

  // createdAt을 yy.mm.dd, hh:mm 으로 분리 (각각 0.25rem 간격용)
  const formatCommentCreatedAt = (
    createdAt: string,
  ): { date: string; time: string } => {
    const trimmed = createdAt.trim();
    const isoMatch = trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
    );
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

  const getDisplayComments = (task: TaskDetailSubTask): TaskDetailSubTaskComment[] => {
    const fromApi = task.comments ?? [];
    const pending = pendingComments[task.subTaskId] ?? [];
    const fromApiContents = new Set(fromApi.map((c) => c.content));
    return [...fromApi, ...pending.filter((p) => !fromApiContents.has(p.content))];
  };

  const handleStatusChange = (subTaskId: number, isChecked: boolean) => {
    const nextStatus: SubTaskStatus = isChecked ? 'COMPLETED' : 'PROGRESS';
    mutateStatus({ subTaskId, status: nextStatus === 'COMPLETED' ? 'COMPLETE' : 'PROGRESS' });
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

  const handleSubmitEditComment = (commentId: number) => {
    const content = editingContent.trim();
    if (commentId < 0 || !content) return;
    updateComment({ commentId, content }).then(() => {
      setEditingCommentId(null);
      setEditingContent('');
    });
  };

  const handleDeleteComment = (
    comment: TaskDetailSubTaskComment,
    subTaskId: number,
  ) => {
    if (comment.commentId >= 0) {
      deleteComment(comment.commentId);
    } else {
      setPendingComments((prev) => ({
        ...prev,
        [subTaskId]: (prev[subTaskId] ?? []).filter(
          (c) => c.commentId !== comment.commentId,
        ),
      }));
    }
  };

  const handleCommentSubmit = (subTaskId: number) => {
    const content = commentInputs[subTaskId]?.trim();
    const userId = myInfo?.user.id;
    if (!content || !userId || !myInfo) return;

    createComment(
      { subTaskId, userId, content },
      {
        onSuccess: () => {
          setCommentInputs((prev) => ({ ...prev, [subTaskId]: '' }));
          const newComment: TaskDetailSubTaskComment = {
            commentId: -1,
            content,
            writer: myInfo.user.nickname ?? '',
            profileImage: myInfo.user.profileImage ?? '',
            createdAt: '방금',
          };
          setPendingComments((prev) => ({
            ...prev,
            [subTaskId]: [...(prev[subTaskId] ?? []), newComment],
          }));
        },
      },
    );
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
                <div className={taskItemContainerStyle({ checked: isCompleted })}>
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
                    <div className={taskComponentsStyle({ checked: isCompleted })}>
                      <DatePicker
                        value={task.deadline}
                        onChange={(date) => handleDeadlineChange(task.subTaskId, date)}
                        muted={isCompleted}
                      />
                      <ClockToggle muted={isCompleted} />
                      <CommentButton
                        isOpen={commentOpen}
                        onClick={() => handleCommentToggle(task.subTaskId)}
                        commentCount={task.commentCount}
                      />
                    </div>
                  </div>
                  <div className={managerContainerStyle({ checked: isCompleted })}>
                    <p className={managerLabelStyle({ checked: isCompleted })}>
                      담당:
                    </p>
                    <TeamTaskManager
                      manager={task.assigneeName}
                      profileImage={task.assigneeProfileImage}
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
                          const isEditing =
                            comment.commentId >= 0 &&
                            editingCommentId === comment.commentId;
                          return (
                            <div
                              key={
                                comment.commentId >= 0
                                  ? comment.commentId
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
                                {isEditing ? (
                                  <Input
                                    size="basic"
                                    value={editingContent}
                                    onChange={(e) =>
                                      setEditingContent(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmitEditComment(
                                          comment.commentId,
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
                                  <p className={commentItemHeaderCommentStyle}>
                                    {comment.content}
                                  </p>
                                )}
                              </div>
                              {!isEditing && (() => {
                                const { date, time } = formatCommentCreatedAt(
                                  comment.createdAt,
                                );
                                return (
                                  <div className={commentItemEtcStyle}>
                                    <div className={commentDateTimeWrapperStyle}>
                                      <span className={commentCreatedAtStyle}>
                                        {date}
                                      </span>
                                      <span className={commentCreatedAtStyle}>
                                        {time}
                                      </span>
                                    </div>
                                    <CommentEditDropdown
                                    onEditComment={() =>
                                      handleStartEditComment(
                                        comment.commentId,
                                        comment.content,
                                      )
                                    }
                                    onDeleteComment={() =>
                                      handleDeleteComment(comment, task.subTaskId)
                                    }
                                  />
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })
                      ) : (
                        <div className={commentItemStyle}>
                          <div className={commentItemHeaderStyle}>
                            <div
                              className={commentItemHeaderProfileStyle}
                              style={
                                myInfo?.user.profileImage
                                  ? {
                                      backgroundImage: `url(${myInfo.user.profileImage})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                    }
                                  : undefined
                              }
                            />
                            <p className={commentItemHeaderCommentStyle}>
                              댓글을 입력해주세요.
                            </p>
                          </div>
                          <div className={commentItemEtcStyle}>
                            <CommentEditDropdown />
                          </div>
                        </div>
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
    textStyle: 'body1',
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
  w: '36.375rem',
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

const commentItemContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
});

const commentItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'full',
});

const commentItemHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
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
