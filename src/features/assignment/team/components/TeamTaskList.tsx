'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import { CommentButton } from './CommentButton';
import { TeamTaskManager } from './TeamTaskManager';
import DatePicker from '@/components/DatePicker';

const TeamTaskList = () => {
  const [checkedTasks, setCheckedTasks] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleCheckboxChange = (taskId: number) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // TODO: 데이터 연동 후 방식 변경
  const task1Checked = checkedTasks[1] || false;
  const task2Checked = checkedTasks[2] || false;

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
              <CommentButton />
            </div>
          </div>

          <div className={managerContainerStyle({ checked: task1Checked })}>
            <p className={managerLabelStyle({ checked: task1Checked })}>
              담당:
            </p>
            <TeamTaskManager manager='두현우' />
          </div>
        </div>

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
              <CommentButton />
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

export default TeamTaskList;
