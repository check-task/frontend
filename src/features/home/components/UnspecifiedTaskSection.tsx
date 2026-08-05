'use client';

import { useMemo, useState } from 'react';
import { css, cva } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { ChevronLineDownIcon } from '@/components/icons/ChevronLineDownIcon';
import { DragIcon } from '@/components/icons/DragIcon';
import type { FolderColor } from '@/types/folder';

export type UnspecifiedSubTask = {
  subTaskId: number;
  taskId: number;
  title: string;
  folderColor: FolderColor;
};

type UnspecifiedTaskSectionProps = {
  tasks: UnspecifiedSubTask[];
};

const MAX_COLLAPSED_COUNT = 5;

export const UnspecifiedTaskSection = ({
  tasks,
}: UnspecifiedTaskSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = tasks.length > MAX_COLLAPSED_COUNT;
  const visibleTasks = useMemo(
    () =>
      canExpand && !expanded ? tasks.slice(0, MAX_COLLAPSED_COUNT) : tasks,
    [canExpand, expanded, tasks],
  );

  if (tasks.length === 0) return null;

  return (
    <section className={sectionStyle}>
      <div className={headerStyle}>
        <h3 className={titleStyle}>날짜 미지정 TASK</h3>
        {canExpand && (
          <button
            type='button'
            className={expandButtonStyle}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span>펼치기</span>
            <span className={expandIconStyle({ expanded })}>
              <ChevronLineDownIcon />
            </span>
          </button>
        )}
      </div>

      <div className={taskWrapStyle}>
        {visibleTasks.map((task) => (
          <button
            key={task.subTaskId}
            type='button'
            className={`${taskItemStyle} unspecified-task-draggable`}
            data-sub-task-id={task.subTaskId}
            data-task-id={task.taskId}
            data-title={task.title}
            data-folder-color={task.folderColor}
            aria-label={`${task.title} 날짜 지정`}
          >
            <DragIcon className={dragIconStyle} />
            <span
              className={taskChipStyle({ color: task.folderColor })}
              title={task.title}
            >
              {task.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

const sectionStyle = css(
  stack.raw({
    gap: '0.5rem',
    width: '100%',
  }),
);

const headerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '1.5rem',
  }),
);

const titleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.800',
});

const expandButtonStyle = css(
  hstack.raw({
    gap: '0.125rem',
    alignItems: 'center',
    color: 'gray.600',
    textStyle: 'body4.r',
    bg: 'transparent',
    border: 'none',
    cursor: 'pointer',
    p: 0,
    '& svg': {
      width: '1rem',
      height: '1rem',
      stroke: 'gray.600',
    },
  }),
);

const expandIconStyle = cva({
  base: {
    display: 'inline-flex',
  },
  variants: {
    expanded: {
      true: { transform: 'rotate(180deg)' },
      false: { transform: 'rotate(0deg)' },
    },
  },
});

const taskWrapStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
});

const taskItemStyle = css(
  hstack.raw({
    gap: 0,
    alignItems: 'center',
    bg: 'transparent',
    border: 'none',
    p: 0,
    cursor: 'grab',
    _active: {
      cursor: 'grabbing',
    },
  }),
);

const dragIconStyle = css({
  width: '0.875rem',
  height: '0.875rem',
  flexShrink: 0,
});

const taskChipStyle = cva({
  base: {
    maxWidth: '8.125rem',
    height: '1.1875rem',
    px: '0.25rem',
    py: '0.125rem',
    borderWidth: '0.0625rem',
    borderStyle: 'solid',
    borderRadius: '0.125rem',
    textStyle: 'caption',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  variants: {
    color: {
      red: {
        color: 'sub.01.100',
        borderColor: 'sub.01.100',
      },
      yellow: {
        color: 'sub.02.100',
        borderColor: 'sub.02.100',
      },
      green: {
        color: 'sub.03.100',
        borderColor: 'sub.03.100',
      },
      purple: {
        color: 'sub.04.100',
        borderColor: 'sub.04.100',
      },
      black: {
        color: 'sub.05.100',
        borderColor: 'sub.05.100',
      },
      null: {
        color: 'sub.null.100',
        borderColor: 'sub.null.100',
      },
    },
  },
});
