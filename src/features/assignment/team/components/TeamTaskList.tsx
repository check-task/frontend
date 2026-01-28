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

const TeamTaskList = () => {
  const [checkedTasks, setCheckedTasks] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleCheckboxChange = (taskId: number) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCommentToggle = (taskId: number) => {
    setOpenComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // TODO: 데이터 연동 후 방식 변경
  const task1Checked = checkedTasks[1] || false;
  const task2Checked = checkedTasks[2] || false;
  const task1CommentOpen = openComments[1] || false;
  const task2CommentOpen = openComments[2] || false;

  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        <div className={taskItemContainerStyle({ checked: task1Checked })}>
          <div className={teamTaskItemTitleStyle}>
            <div className={teamTaskItemCheckTitleStyle}>
              <Checkbox
                checked={task1Checked}
                onChange={() => handleCheckboxChange(1)}
              />
              <p className={taskTextStyle({ checked: task1Checked })}>
                프로젝트 세팅
              </p>
            </div>
            <div className={taskComponentsStyle({ checked: task1Checked })}>
              <DatePicker />
              <ClockToggle />
              <CommentButton
                isOpen={task1CommentOpen}
                onClick={() => handleCommentToggle(1)}
                commentCount={1}
              />
            </div>
          </div>

          <div className={managerContainerStyle({ checked: task1Checked })}>
            <p className={managerLabelStyle({ checked: task1Checked })}>
              담당:
            </p>
            <TeamTaskManager manager='두현우' />
          </div>
        </div>

        {task1CommentOpen && (
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
                  <p className={commentItemHeaderCommentStyle}>
                    수고하셨습니다!
                  </p>
                </div>

                <div className={commentItemEtcStyle}>
                  <p>26.01.29 00:00</p>
                  <CommentEditDropdown />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={taskItemContainerStyle({ checked: task2Checked })}>
          <div className={teamTaskItemTitleStyle}>
            <div className={teamTaskItemCheckTitleStyle}>
              <Checkbox
                checked={task2Checked}
                onChange={() => handleCheckboxChange(2)}
              />
              <p className={taskTextStyle({ checked: task2Checked })}>
                프로젝트 세팅
              </p>
            </div>
            <div className={taskComponentsStyle({ checked: task2Checked })}>
              <DatePicker />
              <ClockToggle />
              <CommentButton
                isOpen={task2CommentOpen}
                onClick={() => handleCommentToggle(2)}
                commentCount={0}
              />
            </div>
          </div>

          <div className={managerContainerStyle({ checked: task2Checked })}>
            <p className={managerLabelStyle({ checked: task2Checked })}>
              담당:
            </p>
            <TeamTaskManager />
          </div>
        </div>
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
