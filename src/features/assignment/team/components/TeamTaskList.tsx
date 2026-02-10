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
import type { TaskDetailSubTask, SubTaskStatus } from '@/types/task';
import { useUpdateTeamSubTaskStatus } from './hooks/useUpdateSubTaskStatus';

interface TeamTaskListProps {
  taskId: number;
  subTasks?: TaskDetailSubTask[];
}

const TeamTaskList = ({ taskId, subTasks = [] }: TeamTaskListProps) => {
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>({});
  const { mutate: mutateStatus } = useUpdateTeamSubTaskStatus(taskId);

  const handleStatusChange = (subTaskId: number, isChecked: boolean) => {
    const nextStatus: SubTaskStatus = isChecked ? 'COMPLETED' : 'PROGRESS';
    mutateStatus({ subTaskId, status: nextStatus === 'COMPLETED' ? 'COMPLETE' : 'PROGRESS' });
  };

  const handleCommentToggle = (taskId: number) => {
    setOpenComments((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        {subTasks.length > 0 ? (
          subTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const commentOpen = openComments[task.subTaskId] ?? false;
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
                      <DatePicker value={task.deadline} muted={isCompleted} />
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
                    <TeamTaskManager manager={task.assigneeName} />
                  </div>
                </div>
                {commentOpen && (
                  <div className={commentSectionStyle}>
                    <div className={inputWrapperStyle}>
                      <Input
                        size='basic'
                        placeholder='댓글 추가'
                        className={commentInputStyle}
                      />
                      <div className={inputProfileIconStyle} />
                    </div>
                    <div className={commentItemContainerStyle}>
                      <div className={commentItemStyle}>
                        <div className={commentItemHeaderStyle}>
                          <div className={commentItemHeaderProfileStyle} />
                          <p className={commentItemHeaderCommentStyle}>댓글을 입력해주세요.</p>
                        </div>
                        <div className={commentItemEtcStyle}>
                          <CommentEditDropdown />
                        </div>
                      </div>
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
  pointerEvents: 'none',
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

const commentItemEtcStyle = css({
  display: 'flex',
  alignItems: 'center',
  textStyle: 'body4.r',
  color: 'gray.400',
});

export default TeamTaskList;
