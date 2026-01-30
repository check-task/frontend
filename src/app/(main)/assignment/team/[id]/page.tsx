import { Divider } from '@/components/Divider';
import { Header } from '@/features/assignment/team/components/TeamHeader';
import { TeamHeaderButton } from '@/features/assignment/team/components/TeamHeaderButtonGroup';
import { TeamEtc } from '@/features/assignment/team/components/TeamEtc';
import TeamTaskList from '@/features/assignment/team/components/TeamTaskList';
import React from 'react';
import { css } from 'styled-system/css';

const page = () => {
  const completionRate = 80; // TODO: 실제 데이터로 교체

  return (
    <div className={containerStyle}>
      <div className={headerContainerStyle}>
        <Header completionRate={completionRate} />
        <TeamHeaderButton />
      </div>

      <div className={taskContainerStyle}>
        <h2 className={css({ textStyle: 'h4', color: 'gray.900' })}>
          TASK 목록
        </h2>
        <TeamTaskList />
      </div>

      <Divider className={css({ mt: '3.75rem', mb: '3.75rem' })} />

      <TeamEtc />
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '75rem',
  maxWidth: '75rem',
  minWidth: '70.125rem',
  pt: '2.5rem',
  pb: '3.75rem',
});

const headerContainerStyle = css({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

const taskContainerStyle = css({
  pt: '2.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
});

export default page;
