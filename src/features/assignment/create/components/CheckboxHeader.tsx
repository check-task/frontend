'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { css } from 'styled-system/css';

export const CheckboxHeader = () => {
  const [isTeamProject, setIsTeamProject] = useState(false);

  return (
    <div className={checkboxWrapperStyle}>
      <div className={checkboxContainerStyle}>
        <Checkbox
          checked={isTeamProject}
          onChange={(e) => setIsTeamProject(e.target.checked)}
        />
        <p>팀프로젝트</p>
      </div>
      {isTeamProject && (
        <div className={checkboxContainerStyle}>
          <Checkbox />
          <p>웬투밋 추가</p>
        </div>
      )}
    </div>
  );
};

const checkboxWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.75rem',
});

const checkboxContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textStyle: 'body1.m',
  color: 'gray.600',
});
