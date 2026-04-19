'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { SelectTeamProjectCheckbox } from './SelectTeamProjectCheckbox';
import { css } from 'styled-system/css';

interface CheckboxHeaderProps {
  isTeamProject?: boolean;
  onTeamProjectChange?: (checked: boolean) => void;
}

export const CheckboxHeader = ({
  isTeamProject: controlledTeam,
  onTeamProjectChange,
}: CheckboxHeaderProps) => {
  const [internalTeam, setInternalTeam] = useState(false);
  const isTeamProject =
    onTeamProjectChange != null ? (controlledTeam ?? false) : internalTeam;
  const setTeam =
    onTeamProjectChange != null ? onTeamProjectChange : setInternalTeam;

  return (
    <div className={checkboxWrapperStyle}>
      <div className={checkboxContainerStyle}>
        <SelectTeamProjectCheckbox
          checked={isTeamProject}
          onChange={(e) => setTeam(e.target.checked)}
        />
        <p>팀프로젝트</p>
      </div>
      {/* {isTeamProject && (
        <div className={checkboxContainerStyle}> */}
      {/* 체크박스 변경 */}
      {/* <SelectTeamProjectCheckbox />
          <p>웬투밋 추가</p>
        </div>
      )} */}
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
