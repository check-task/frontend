import { Checkbox } from '@/components/Checkbox';
import React from 'react';
import { css } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import { CommentButton } from './CommentButton';
import { TeamTaskManager } from './TeamTaskManager';

const TeamTaskList = () => {
  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        <div className={teamTaskItemContainerStyle}>
          <div className={teamTaskItemTitleStyle}>
            <div className={teamTaskItemCheckTitleStyle}>
              <Checkbox />
              <p className={css({ textStyle: 'body1', color: 'gray.900' })}>
                프로젝트 세팅
              </p>
            </div>
            <div className={teamTaskItemComponentStyle}>
              <div>DatePicker</div>
              <ClockToggle />
              <CommentButton />
            </div>
          </div>

          <div className={teamTaskItemManagerContainerStyle}>
            <p className={css({ textStyle: 'body3', color: 'gray.600' })}>
              담당:
            </p>
            <TeamTaskManager manager='두현우' />
          </div>
        </div>

        <div className={teamTaskItemContainerStyle}>
          <div className={teamTaskItemTitleStyle}>
            <div className={teamTaskItemCheckTitleStyle}>
              <Checkbox />
              <p className={css({ textStyle: 'body1', color: 'gray.900' })}>
                프로젝트 세팅
              </p>
            </div>
            <div className={teamTaskItemComponentStyle}>
              <div>DatePicker</div>
              <ClockToggle />
              <CommentButton />
            </div>
          </div>

          <div className={teamTaskItemManagerContainerStyle}>
            <p className={css({ textStyle: 'body3', color: 'gray.600' })}>
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

const teamTaskItemContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

const teamTaskItemComponentStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
});

const teamTaskItemManagerContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export default TeamTaskList;
